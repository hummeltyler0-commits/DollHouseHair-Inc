const services = [
  {
    name: "Butterfly Locs",
    category: "Locs / Dreads",
    details: "Protective loc style with size-based pricing.",
    sizes: [
      { name: "Large", price: 75, durationMinutes: 180 },
      { name: "Medium", price: 85, durationMinutes: 240 },
      { name: "Smedium", price: 95, durationMinutes: 300 }
    ]
  },
  {
    name: "Soft Locs",
    category: "Locs / Dreads",
    details: "Soft loc style with size-based pricing.",
    sizes: [
      { name: "Medium", price: 90, durationMinutes: 180 },
      { name: "Smedium", price: 100, durationMinutes: 240 },
      { name: "Small", price: 115, durationMinutes: 300 }
    ]
  },
  {
    name: "Retwists",
    category: "Locs / Dreads",
    details: "Retwist options. Retwist duration is 2 hours even with style.",
    sizes: [
      { name: "No Style", price: 45, durationMinutes: 120 },
      { name: "Style, No Hair Added", price: 50, durationMinutes: 120 },
      { name: "Style, Hair Added", price: 75, durationMinutes: 120 }
    ]
  },
  {
    name: "Island Twists",
    category: "Twists",
    details: "Island twist style with size-based pricing.",
    sizes: [
      { name: "Large", price: 85, durationMinutes: 240 },
      { name: "Medium", price: 95, durationMinutes: 300 },
      { name: "Smedium", price: 120, durationMinutes: 360 },
      { name: "Small", price: 150, durationMinutes: 480 },
      { name: "Extra Small", price: 0, durationMinutes: 600 }
    ]
  },
  {
    name: "Natural Twists Bob",
    category: "Twists",
    details: "Bob-length natural twists.",
    sizes: [
      { name: "Medium", price: 75, durationMinutes: 210 },
      { name: "Smedium", price: 85, durationMinutes: 240 },
      { name: "Small", price: 95, durationMinutes: 300 }
    ]
  },
  {
    name: "Knotless Braids",
    category: "Braids",
    details: "Knotless braids without add-ons. Add-ons may increase time.",
    sizes: [
      { name: "Large", price: 75, durationMinutes: 180 },
      { name: "Medium", price: 100, durationMinutes: 240 },
      { name: "Smedium", price: 125, durationMinutes: 300 },
      { name: "Small", price: 150, durationMinutes: 420 },
      { name: "Extra Small", price: 200, durationMinutes: 540 }
    ]
  },
  {
    name: "Scalp Braids Hair Added",
    category: "Braids",
    details: "Scalp braids with hair added.",
    sizes: [
      { name: "Large (2-4 Braids)", price: 50, durationMinutes: 120 },
      { name: "Medium (6-8 Braids)", price: 70, durationMinutes: 120 },
      { name: "Smedium (10-14 Braids)", price: 80, durationMinutes: 180 },
      { name: "Small (14-20 Braids)", price: 90, durationMinutes: 240 },
      { name: "XSmall (20+ Braids)", price: 100, durationMinutes: 300 }
    ]
  },
  {
    name: "Scalp Braids No Hair",
    category: "Braids",
    details: "Scalp braids without hair added.",
    sizes: [
      { name: "Large", price: 40, durationMinutes: 120 },
      { name: "Medium", price: 40, durationMinutes: 120 },
      { name: "Smedium", price: 50, durationMinutes: 180 }
    ]
  },
  {
    name: "Tribal / Fulani Braids",
    category: "Braids",
    details: "Tribal and Fulani braid styles.",
    sizes: [
      { name: "Large & Medium", price: 90, durationMinutes: 180 },
      { name: "Smedium", price: 110, durationMinutes: 240 },
      { name: "Small", price: 125, durationMinutes: 360 }
    ]
  },
  {
    name: "Miracle Knots",
    category: "Braids",
    details: "Miracle knot styles.",
    sizes: [
      { name: "Large", price: 70, durationMinutes: 180 },
      { name: "Medium", price: 80, durationMinutes: 180 },
      { name: "Smedium", price: 90, durationMinutes: 180 },
      { name: "Small", price: 100, durationMinutes: 240 }
    ]
  },
  {
    name: "Half Up Half Down Ponytail",
    category: "Other",
    details: "Any type of half up half down ponytail.",
    sizes: [
      { name: "Standard", price: 75, durationMinutes: 120 }
    ]
  },
  {
    name: "Ponytail",
    category: "Other",
    details: "Classic ponytail style.",
    sizes: [
      { name: "Standard", price: 50, durationMinutes: 120 }
    ]
  },
  {
    name: "Quick Weave with Braids in Front",
    category: "Other",
    details: "Quick weave with braids in front.",
    sizes: [
      { name: "Standard", price: 95, durationMinutes: 180 }
    ]
  },
  {
    name: "Leave Out Quick Weave",
    category: "Other",
    details: "Leave-out quick weave.",
    sizes: [
      { name: "Standard", price: 100, durationMinutes: 180 }
    ]
  },
  {
    name: "Half Up Half Down Quick Weave",
    category: "Other",
    details: "Any style half up half down quick weave.",
    sizes: [
      { name: "Standard", price: 85, durationMinutes: 180 }
    ]
  },
  {
    name: "Refreshing / Redo the Front",
    category: "Other",
    details: "50% of the original style price.",
    sizes: [
      { name: "Custom Quote / 50% Original Price", price: 0, durationMinutes: 120 }
    ]
  },
  {
    name: "Take Downs",
    category: "Other",
    details: "50% of the original style price.",
    sizes: [
      { name: "Custom Quote / 50% Original Price", price: 0, durationMinutes: 120 }
    ]
  }
];

const lengthOptions = [
  { name: "Bob/Shoulder", price: 25 },
  { name: "Mid Back", price: 0 },
  { name: "Butt", price: 10 },
  { name: "Thigh", price: 25 }
];

const bohoOptions = [
  { name: "No Boho", price: 0 },
  { name: "Regular Boho", price: 5 },
  { name: "Extra Boho", price: 10 },
  { name: "Bora Bora Boho", price: 20 }
];

const hairOptions = [
  { name: "No, I am bringing hair", price: 0, value: "No" },
  { name: "Yes, stylist provides hair", price: 20, value: "Yes" }
];

let booking = {
  service: null,
  size: null,
  length: lengthOptions[1],
  boho: bohoOptions[0],
  hair: hairOptions[0],
  date: "",
  time24: "",
  timeLabel: ""
};

let calendarCursor = new Date();
calendarCursor.setDate(1);
let availabilityCache = {};

function money(amount) {
  return `$${Number(amount).toFixed(0)}`;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours && mins) return `${hours} hr ${mins} min`;
  if (hours) return `${hours} hr`;
  return `${mins} min`;
}

function startingPrice(service) {
  return Math.min(...service.sizes.map(size => size.price));
}

function renderServices() {
  const grouped = services.reduce((acc, service, index) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push({ service, index });
    return acc;
  }, {});

  document.getElementById("serviceList").innerHTML = Object.entries(grouped).map(([category, items]) => `
    <div class="service-category">
      <h3>${category}</h3>
      ${items.map(({ service, index }) => `
        <div class="service-card ${booking.service?.name === service.name ? "selected" : ""}">
          <div>
            <strong>${service.name}</strong>
            <span class="price">Starting at ${money(startingPrice(service))}</span>
            <p class="muted">${service.details}</p>
          </div>
          <button onclick="selectService(${index})">Select</button>
        </div>
      `).join("")}
    </div>
  `).join("");
}

function renderSizeOptions() {
  const box = document.getElementById("sizeOptions");
  if (!booking.service) {
    box.innerHTML = `<p class="muted">Select a style first.</p>`;
    return;
  }

  box.innerHTML = booking.service.sizes.map((size, index) => `
    <div class="option ${booking.size?.name === size.name ? "selected" : ""}" onclick="selectSize(${index})">
      <strong>${size.name}</strong>
      <small>${money(size.price)} • ${formatDuration(size.durationMinutes)}</small>
    </div>
  `).join("");
}

function renderOptionGroup(id, options, selectedName, callback) {
  document.getElementById(id).innerHTML = options.map((option, index) => `
    <div class="option ${selectedName === option.name ? "selected" : ""}" onclick="${callback}(${index})">
      <strong>${option.name}</strong>
      <small>${option.price === 0 ? "Included" : "+" + money(option.price)}</small>
    </div>
  `).join("");
}

function renderAddOns() {
  renderOptionGroup("lengthOptions", lengthOptions, booking.length.name, "selectLength");
  renderOptionGroup("bohoOptions", bohoOptions, booking.boho.name, "selectBoho");
  renderOptionGroup("hairOptions", hairOptions, booking.hair.name, "selectHair");
}

function selectService(index) {
  booking.service = services[index];
  booking.size = null;
  renderServices();
  renderSizeOptions();
  updateSummary();
  goFlow(2);
}

function selectSize(index) {
  booking.size = booking.service.sizes[index];
  renderSizeOptions();
  updateSummary();
}

function validateSize() {
  if (!booking.size) {
    alert("Please choose a size/option for this style.");
    return;
  }
  goFlow(3);
}

function selectLength(index) {
  booking.length = lengthOptions[index];
  renderAddOns();
  updateSummary();
}

function selectBoho(index) {
  booking.boho = bohoOptions[index];
  renderAddOns();
  updateSummary();
}

function selectHair(index) {
  booking.hair = hairOptions[index];
  renderAddOns();
  updateSummary();
}

function total() {
  if (!booking.service || !booking.size) return 0;
  return booking.size.price + booking.length.price + booking.boho.price + booking.hair.price;
}

function depositAmount() {
  if (!booking.service || !booking.size) return 0;
  return 20 + booking.length.price + (booking.hair.value === "Yes" ? 20 : 0);
}

function addOns() {
  return [
    { name: `Size: ${booking.size?.name || "Not selected"} (${formatDuration(booking.size?.durationMinutes || 0)})`, price: booking.size?.price || 0 },
    { name: booking.length.name, price: booking.length.price },
    { name: booking.boho.name, price: booking.boho.price },
    { name: `Hair Provided: ${booking.hair.value}`, price: booking.hair.price }
  ].filter(item => item.name.includes("Size:") || item.price > 0 || item.name.includes("Hair Provided"));
}

function updateSummary() {
  document.getElementById("runningTotal").textContent = money(total());
  document.getElementById("summaryText").innerHTML = booking.service
    ? `${booking.service.name}<br>${booking.size ? booking.size.name : "Choose size"} • ${booking.length.name}<br>Deposit: ${money(depositAmount())}`
    : "Select a style to begin.";
  const depositDue = document.getElementById("depositDue");
  if (depositDue) depositDue.textContent = money(depositAmount());
}

function goFlow(step) {
  if (step > 1 && !booking.service) {
    alert("Please select a style first.");
    return;
  }
  if (step > 2 && !booking.size) {
    alert("Please select a size/option first.");
    return;
  }

  document.querySelectorAll(".flow-step").forEach(el => el.classList.remove("active"));
  document.querySelector(`[data-flow="${step}"]`).classList.add("active");

  for (let i = 1; i <= 6; i++) {
    const item = document.getElementById(`nav${i}`);
    if (item) item.classList.toggle("active-step", i === step);
  }

  if (step === 2) renderSizeOptions();
  if (step === 3) renderAddOns();
  if (step === 4) { renderBooksyCalendar(); renderTimes(); }
  if (step === 5) renderFinalSummary();
  if (step === 6) updateSummary();
}

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function prettyDate(dateString) {
  if (!dateString) return "Choose a date";
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

async function getAvailability(dateString) {
  if (availabilityCache[dateString]) return availabilityCache[dateString];
  const duration = booking.size?.durationMinutes || 180;
  const response = await fetch(`/api/availability?date=${encodeURIComponent(dateString)}&duration=${encodeURIComponent(duration)}`);
  const data = await response.json();
  availabilityCache[dateString] = data.slots || [];
  return availabilityCache[dateString];
}

async function renderBooksyCalendar() {
  const grid = document.getElementById("calendarGrid");
  const label = document.getElementById("calendarMonthLabel");
  if (!grid || !label) return;

  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();

  label.textContent = calendarCursor.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });

  grid.innerHTML = `<div class="calendar-loading">Loading calendar...</div>`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  today.setHours(0,0,0,0);

  const cells = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    cells.push(`<button type="button" class="calendar-day empty" disabled></button>`);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dateString = localDateString(date);
    const isPast = date < today;
    const isSelected = booking.date === dateString;

    let slots = [];
    try {
      slots = isPast ? [] : await getAvailability(dateString);
    } catch {
      slots = [];
    }

    const hasTimes = slots.length > 0;
    const classes = [
      "calendar-day",
      isPast ? "past" : "",
      hasTimes ? "has-times" : "no-times",
      isSelected ? "selected" : ""
    ].join(" ");

    cells.push(`
      <button type="button" class="${classes}" ${isPast || !hasTimes ? "disabled" : ""} onclick="selectCalendarDate('${dateString}')">
        <span>${day}</span>
        <small>${hasTimes ? slots.length + " times" : isPast ? "" : "Full"}</small>
      </button>
    `);
  }

  grid.innerHTML = cells.join("");
  document.getElementById("selectedDateLabel").textContent = prettyDate(booking.date);
}

function changeCalendarMonth(direction) {
  calendarCursor.setMonth(calendarCursor.getMonth() + direction);
  renderBooksyCalendar();
}

async function selectCalendarDate(dateString) {
  booking.date = dateString;
  booking.time24 = "";
  booking.timeLabel = "";
  document.getElementById("selectedDateLabel").textContent = prettyDate(dateString);
  await renderTimes();
  await renderBooksyCalendar();
}

async function renderTimes() {
  const box = document.getElementById("timeSlots");
  if (!box) return;

  if (!booking.date) {
    box.innerHTML = `<p class="muted">Pick a date to see available times.</p>`;
    return;
  }

  box.innerHTML = `<p class="muted">Loading available times...</p>`;

  try {
    const slots = await getAvailability(booking.date);

    box.innerHTML = slots.length ? slots.map(slot => `
      <div class="time-chip ${booking.time24 === slot.time24 ? "selected" : ""}" onclick="selectTime('${slot.time24}', '${slot.label}')">
        <strong>${slot.label}</strong>
        <small>Available</small>
      </div>
    `).join("") : `<p class="muted">No available times for this date.</p>`;
  } catch {
    box.innerHTML = `<p class="muted">Could not load times. Try again.</p>`;
  }
}

function selectTime(time24, label) {
  booking.time24 = time24;
  booking.timeLabel = label;
  document.querySelectorAll("#timeSlots .time-chip").forEach(el => {
    el.classList.toggle("selected", el.textContent.includes(label));
  });
}

function validateCalendar() {
  if (!booking.date || !booking.time24) {
    alert("Please choose a date and time.");
    return;
  }
  goFlow(5);
}

function renderFinalSummary() {
  document.getElementById("finalSummary").innerHTML = `
    <p><strong>Style:</strong> ${booking.service.name}</p>
    <p><strong>Size/Option:</strong> ${booking.size.name} — ${money(booking.size.price)}</p>
    <p><strong>Estimated Duration:</strong> ${formatDuration(booking.size.durationMinutes)}</p>
    <p><strong>Add-ons:</strong> ${booking.length.name}, ${booking.boho.name}, Hair Provided: ${booking.hair.value}</p>
    <p><strong>Date/Time:</strong> ${booking.date} at ${booking.timeLabel}</p>
    <p><strong>Total:</strong> ${money(total())}</p>
    <p><strong>Deposit Due Now:</strong> ${money(depositAmount())}</p>
    <p><strong>Address:</strong> Sent by SMS after deposit is confirmed.</p>
  `;
}

function validateInfo() {
  const name = document.getElementById("clientName").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();

  if (!name || !phone) {
    alert("Please enter your name and phone number.");
    return;
  }

  goFlow(6);
}

function bookingPayload() {
  return {
    name: document.getElementById("clientName").value.trim(),
    mobile: document.getElementById("clientPhone").value.trim(),
    serviceName: booking.service.name,
    servicePrice: booking.size.price,
    serviceSize: booking.size.name,
    addOns: JSON.stringify(addOns()),
    date: booking.date,
    time24: booking.time24,
    timeLabel: booking.timeLabel,
    durationMinutes: booking.size.durationMinutes,
    hairProvided: booking.hair.value,
    total: total(),
    depositAmount: depositAmount(),
    notes: document.getElementById("clientNotes").value.trim()
  };
}

async function payWithStripe() {
  const payload = bookingPayload();
  const button = document.getElementById("stripeBtn");
  button.disabled = true;
  button.textContent = "Opening checkout...";

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Stripe is not available.");
    window.location.href = data.url;
  } catch (error) {
    alert(error.message + " Online payment is not configured yet. Use the Cash App backup or add Stripe keys.");
  } finally {
    button.disabled = false;
    button.textContent = "Pay Deposit & Book Appointment";
  }
}

async function submitBooking() {
  const depositProof = document.getElementById("depositProof").files[0];
  const fullPaymentProof = document.getElementById("fullPaymentProof").files[0];
  const depositConfirm = document.getElementById("depositConfirm").checked;

  if (!depositConfirm || !depositProof) {
    alert("Please confirm deposit payment and upload proof before booking.");
    return;
  }

  const formData = new FormData();
  const payload = bookingPayload();
  Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
  formData.append("depositProof", depositProof);
  if (fullPaymentProof) formData.append("fullPaymentProof", fullPaymentProof);

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Booking...";

  try {
    const response = await fetch("/api/book-cashapp", { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Booking failed.");

    document.getElementById("bookingId").textContent = data.bookingId;
    const text = encodeURIComponent(
`DollhouseHair Booking
ID: ${data.bookingId}
Name: ${payload.name}
Phone: ${payload.mobile}
Style: ${booking.service.name}
Size: ${booking.size.name}
Date/Time: ${booking.date} at ${booking.timeLabel}
Total: ${money(total())}
Deposit: ${money(depositAmount())}
Deposit submitted. Address will be sent by SMS after confirmation.`
    );

    document.getElementById("smsCopy").href = `sms:3187892802?body=${text}`;
    goFlow(7);
  } catch (error) {
    alert(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Book with Cash App Proof";
  }
}

renderServices();
renderSizeOptions();
renderAddOns();
updateSummary();
