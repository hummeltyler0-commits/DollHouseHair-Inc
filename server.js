const express = require("express");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const nodemailer = require("nodemailer");
const session = require("express-session");
const cron = require("node-cron");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve frontend properly
app.use(express.static(path.join(__dirname, "public")));

// ✅ Homepage route (moved to correct spot)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "dollhousehair-local-secret",
  resave: false,
  saveUninitialized: false
}));

app.use("/uploads", express.static(uploadsDir));

// ---------- HELPERS ----------

function readSettings() {
  return JSON.parse(fs.readFileSync(settingsPath, "utf8"));
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

function formatTime(time24) {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:${String(m).padStart(2, "0")} ${suffix}`;
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
      const taken = bookings.some(b =>
        overlaps(t, end, b.time24, addMinutes(b.time24, b.durationMinutes || duration))
      );
      if (!taken) slots.push({ time24: t, label: formatTime(t), available: true });
      t = addMinutes(t, interval);
    }
  }
  return slots;
}

// ---------- ROUTES ----------

app.get("/api/settings", (req, res) => {
  res.json(readSettings());
});

app.get("/api/availability", (req, res) => {
  // TEMP: Always return available times
  const slots = [
    { time24: "10:00", label: "10:00 AM" },
    { time24: "12:00", label: "12:00 PM" },
    { time24: "14:00", label: "2:00 PM" },
    { time24: "16:00", label: "4:00 PM" },
    { time24: "18:00", label: "6:00 PM" }
  ];

  res.json({ slots });
});, (req, res) => {
  const date = req.query.date;
  if (!date) return res.status(400).json({ error: "Date required." });
  res.json({ date, slots: slotsForDate(date) });
});

// ---------- START SERVER ----------

app.listen(PORT, () => {
  console.log(`DollhouseHair running on port ${PORT}`);
});
