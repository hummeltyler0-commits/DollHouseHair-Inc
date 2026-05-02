const express = require("express");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const session = require("express-session");
const cron = require("node-cron");
require("dotenv").config();

let Stripe = null;
let stripe = null;
try {
  Stripe = require("stripe");
  if (process.env.STRIPE_SECRET_KEY) stripe = Stripe(process.env.STRIPE_SECRET_KEY);
} catch {}

let twilioClient = null;
try {
  const twilio = require("twilio");
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
} catch {}

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, "uploads");
const dataDir = path.join(__dirname, "data");
const bookingsPath = path.join(dataDir, "bookings.json");
const settingsPath = path.join(dataDir, "settings.json");

for (const dir of [uploadsDir, dataDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}
if (!fs.existsSync(bookingsPath)) fs.writeFileSync(bookingsPath, "[]");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "dollhousehair-local-secret",
  resave: false,
  saveUninitialized: false
}));
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(path.join(__dirname, "public")));

const jsonParser = express.json();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image uploads are allowed."));
  }
});

function readSettings() {
  return JSON.parse(fs.readFileSync(settingsPath, "utf8"));
}

function fileToDataUrl(filePath, mimeType) {
  const data = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${data.toString("base64")}`;
}

async function reviewCashAppScreenshot(file, bookingDraft) {
  const manualFallback = {
    aiReviewStatus: "Manual Review Required",
    aiReviewScore: 0,
    aiReviewNotes: "AI review is not enabled. Manually compare the screenshot with your Cash App activity before approving.",
    aiReviewFlags: ["AI review disabled"],
    aiVerified: false
  };

  if (process.env.AI_REVIEW_ENABLED !== "true" || !process.env.OPENAI_API_KEY) {
    return manualFallback;
  }

  try {
    const imageDataUrl = fileToDataUrl(file.path, file.mimetype);
    const expectedAmount = bookingDraft.depositAmount;
    const expectedRecipient = process.env.CASHAPP_TAG || "Kenaw08";

    const prompt = `
You are reviewing a Cash App payment screenshot for a hair appointment deposit.

Expected recipient: $${expectedRecipient}
Expected deposit amount: $${expectedAmount}
Client name: ${bookingDraft.name}
Appointment date: ${bookingDraft.date}
Appointment time: ${bookingDraft.timeLabel}

Return ONLY valid JSON with:
{
  "status": "Looks Valid" | "Needs Manual Review" | "Likely Invalid",
  "score": number from 0 to 100,
  "notes": "short explanation",
  "flags": ["short list"],
  "detectedAmount": "amount or unknown",
  "detectedRecipient": "recipient or unknown",
  "detectedDate": "date or unknown"
}

Be strict. If the amount, recipient, completed payment status, or screenshot authenticity is unclear, use Needs Manual Review or Likely Invalid. Do not guarantee authenticity.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.AI_REVIEW_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageDataUrl } }
            ]
          }
        ],
        temperature: 0
      })
    });

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content || "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      aiReviewStatus: parsed.status || "Needs Manual Review",
      aiReviewScore: Number(parsed.score || 0),
      aiReviewNotes: parsed.notes || "AI returned no notes.",
      aiReviewFlags: Array.isArray(parsed.flags) ? parsed.flags : [],
      aiDetectedAmount: parsed.detectedAmount || "unknown",
      aiDetectedRecipient: parsed.detectedRecipient || "unknown",
      aiDetectedDate: parsed.detectedDate || "unknown",
      aiVerified: parsed.status === "Looks Valid" && Number(parsed.score || 0) >= 85
    };
  } catch (error) {
    return {
      aiReviewStatus: "Manual Review Required",
      aiReviewScore: 0,
      aiReviewNotes: `AI review failed: ${error.message}`,
      aiReviewFlags: ["AI review error"],
      aiVerified: false
    };
  }
}


function readBookings() {
  return JSON.parse(fs.readFileSync(bookingsPath, "utf8"));
}

function writeBookings(bookings) {
  fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));
}

function addMinutes(time, minutes) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toTimeString().slice(0,5);
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

function slotsForDate(date) {
  const settings = readSettings();
  if (settings.blockedDates.includes(date)) return [];

  const weekday = new Date(`${date}T12:00:00`).getDay().toString();
  const ranges = settings.hours[weekday] || [];
  const bookings = readBookings().filter(b => b.date === date && !["Cancelled", "Declined"].includes(b.status));

  const slots = [];
  const duration = settings.bookingRules.defaultDurationMinutes;
  const interval = settings.bookingRules.slotIntervalMinutes;

  for (const range of ranges) {
    let t = range.start;
    while (addMinutes(t, duration) <= range.end) {
      const end = addMinutes(t, duration);
      const taken = bookings.some(b => overlaps(t, end, b.time24, addMinutes(b.time24, b.durationMinutes || duration)));
      if (!taken) slots.push({ time24: t, label: formatTime(t), available: true });
      t = addMinutes(t, interval);
    }
  }
  return slots;
}

function formatTime(time24) {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:${String(m).padStart(2, "0")} ${suffix}`;
}

async function sendSms(to, body) {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) return false;
  await twilioClient.messages.create({
    to,
    from: process.env.TWILIO_PHONE_NUMBER,
    body
  });
  return true;
}

async function sendEmailNotification(booking, uploadedFiles = []) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.NOTIFY_EMAIL) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL,
    subject: `New DollhouseHair Booking - ${booking.name}`,
    text: `
New DollhouseHair Booking

ID: ${booking.id}
Status: ${booking.status}
Name: ${booking.name}
Mobile: ${booking.mobile}
Service: ${booking.serviceName}
Add-ons: ${booking.addOns.map(a => `${a.name} (+$${a.price})`).join(", ")}
Appointment: ${booking.date} at ${booking.timeLabel}
Total: $${booking.total}
Deposit: $${booking.depositAmount}
Payment Method: ${booking.paymentMethod}
Notes: ${booking.notes || "None"}
    `,
    attachments: uploadedFiles.map(file => ({ filename: file.originalname, path: file.path }))
  });
}

function isAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ error: "Not logged in." });
}

app.get("/api/settings", (req, res) => res.json(readSettings()));

app.get("/api/availability", (req, res) => {
  const date = req.query.date;
  if (!date) return res.status(400).json({ error: "Date required." });
  res.json({ date, slots: slotsForDate(date) });
});

app.post(
  "/api/book-cashapp",
  upload.fields([
    { name: "depositProof", maxCount: 1 },
    { name: "fullPaymentProof", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const body = req.body;
      const required = ["name", "mobile", "serviceName", "servicePrice", "date", "time24", "timeLabel", "hairProvided", "total", "depositAmount"];
      for (const field of required) {
        if (!body[field]) return res.status(400).json({ error: `Missing ${field}.` });
      }
      if (!req.files?.depositProof?.length) {
        return res.status(400).json({ error: "Deposit proof screenshot is required." });
      }

      const stillAvailable = slotsForDate(body.date).some(s => s.time24 === body.time24);
      if (!stillAvailable) return res.status(409).json({ error: "That time was just booked. Please choose another time." });

      let addOns = [];
      try { addOns = JSON.parse(body.addOns || "[]"); } catch {}

      const aiReview = await reviewCashAppScreenshot(req.files.depositProof[0], {
        name: body.name,
        depositAmount: Number(body.depositAmount),
        date: body.date,
        timeLabel: body.timeLabel
      });

      const booking = {
        id: "DHH-" + Date.now(),
        status: "Booked",
        paymentStatus: "Deposit proof uploaded",
        paymentMethod: "Cash App",
        proofReview: aiReview,
        adminApprovalRequired: !aiReview.aiVerified,
        createdAt: new Date().toISOString(),
        reminderSent: false,
        name: body.name,
        mobile: body.mobile,
        serviceName: body.serviceName,
        servicePrice: Number(body.servicePrice),
        serviceSize: body.serviceSize || '',
        addOns,
        date: body.date,
        time24: body.time24,
        timeLabel: body.timeLabel,
        durationMinutes: Number(body.durationMinutes || readSettings().bookingRules.defaultDurationMinutes),
        hairProvided: body.hairProvided,
        total: Number(body.total),
        depositAmount: Number(body.depositAmount),
        notes: body.notes || "",
        depositProofFile: req.files.depositProof[0].filename,
        fullPaymentProofFile: req.files.fullPaymentProof?.[0]?.filename || null
      };

      const bookings = readBookings();
      bookings.push(booking);
      writeBookings(bookings);

      await sendEmailNotification(booking, [req.files.depositProof[0], ...(req.files.fullPaymentProof || [])]);

      await sendSms(
        booking.mobile,
        `DollhouseHair: Your appointment request is booked for ${booking.date} at ${booking.timeLabel}. Deposit received. Address: ${process.env.BUSINESS_ADDRESS || readSettings().businessAddress || "Address will be sent soon"}. Booking ID: ${booking.id}`
      );

      res.json({ success: true, bookingId: booking.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Server error." });
    }
  }
);

app.post("/api/create-checkout-session", jsonParser, async (req, res) => {
  if (!stripe) return res.status(400).json({ error: "Stripe is not configured. Use Cash App proof upload instead." });

  try {
    const bookingData = req.body;
    const stillAvailable = slotsForDate(bookingData.date).some(s => s.time24 === bookingData.time24);
    if (!stillAvailable) return res.status(409).json({ error: "That time is no longer available." });

    const site = process.env.PUBLIC_SITE_URL || `http://localhost:${PORT}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "cashapp"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `DollhouseHair Deposit - ${bookingData.serviceName}` },
          unit_amount: Math.round(Number(bookingData.depositAmount) * 100)
        },
        quantity: 1
      }],
      success_url: `${site}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/#services`,
      metadata: {
        bookingData: JSON.stringify(bookingData).slice(0, 4500)
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/webhook/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(400).send("Stripe webhook not configured.");
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    let data = {};
    try { data = JSON.parse(session.metadata.bookingData); } catch {}

    const stillAvailable = slotsForDate(data.date).some(s => s.time24 === data.time24);
    if (stillAvailable) {
      const aiReview = await reviewCashAppScreenshot(req.files.depositProof[0], {
        name: body.name,
        depositAmount: Number(body.depositAmount),
        date: body.date,
        timeLabel: body.timeLabel
      });

      const booking = {
        id: "DHH-" + Date.now(),
        status: "Booked",
        paymentStatus: "Deposit paid by Stripe",
        paymentMethod: "Stripe",
        stripeSessionId: session.id,
        createdAt: new Date().toISOString(),
        reminderSent: false,
        ...data
      };
      const bookings = readBookings();
      bookings.push(booking);
      writeBookings(bookings);

      await sendSms(
        booking.mobile,
        `DollhouseHair: Your appointment is booked for ${booking.date} at ${booking.timeLabel}. Deposit paid. Address: ${process.env.BUSINESS_ADDRESS || readSettings().businessAddress || "Address will be sent soon"}. Booking ID: ${booking.id}`
      );
      await sendEmailNotification(booking, []);
    }
  }
  res.json({ received: true });
});

app.post("/api/admin/login", jsonParser, (req, res) => {
  const { username, password } = req.body;
  if (username === (process.env.ADMIN_USERNAME || "kennedywoods") && password === (process.env.ADMIN_PASSWORD || "dollhousehairinc")) {
    req.session.admin = true;
    return res.json({ success: true });
  }
  res.status(401).json({ error: "Wrong username or password." });
});

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.get("/api/admin/bookings", isAdmin, (req, res) => {
  res.json(readBookings().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.patch("/api/admin/bookings/:id", jsonParser, isAdmin, (req, res) => {
  const bookings = readBookings();
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });
  Object.assign(booking, req.body);
  writeBookings(bookings);
  res.json({ success: true, booking });
});


app.post("/api/admin/bookings/:id/approve-proof", isAdmin, async (req, res) => {
  const bookings = readBookings();
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });

  booking.adminApprovalRequired = false;
  booking.status = "Booked";
  booking.paymentStatus = "Deposit proof approved by admin";
  booking.proofApprovedAt = new Date().toISOString();

  writeBookings(bookings);

  await sendSms(
    booking.mobile,
    `DollhouseHair: Your deposit proof has been approved. Your appointment is booked for ${booking.date} at ${booking.timeLabel}. Address: ${process.env.BUSINESS_ADDRESS || readSettings().businessAddress || "Address will be sent soon"}. Booking ID: ${booking.id}`
  );

  res.json({ success: true, booking });
});

app.delete("/api/admin/bookings/:id", isAdmin, (req, res) => {
  const bookings = readBookings();
  const updated = bookings.filter(b => b.id !== req.params.id);
  writeBookings(updated);
  res.json({ success: true });
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

cron.schedule("0 * * * *", async () => {
  const bookings = readBookings();
  const now = new Date();
  let changed = false;

  for (const booking of bookings) {
    if (booking.reminderSent || booking.status !== "Booked") continue;
    const appt = new Date(`${booking.date}T${booking.time24}:00`);
    const diffHours = (appt - now) / (1000 * 60 * 60);

    if (diffHours <= 24 && diffHours > 0) {
      const sent = await sendSms(
        booking.mobile,
        `Reminder: Your DollhouseHair appointment is tomorrow/soon at ${booking.timeLabel} on ${booking.date}. Please arrive washed and blow dried. 💕`
      );
      if (sent) {
        booking.reminderSent = true;
        changed = true;
      }
    }
  }

  if (changed) writeBookings(bookings);
});

app.listen(PORT, () => {
  console.log(`DollhouseHair running on http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
