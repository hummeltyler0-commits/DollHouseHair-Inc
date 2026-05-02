# DollhouseHair Rebuilt Services Booking Platform

This version rebuilds the service system properly.

## Booking flow

1. Pick style
2. Pick size / option
3. Add add-ons
4. Pick Booksy-style calendar date and time
5. Enter name and phone number
6. Send deposit

## What changed

- Services now use real size/option choices.
- Total updates from the selected size, not just the lowest “starting at” price.
- “Starting at” is shown on service cards.
- Confirmation page says the address was texted.
- Reschedule and non-refundable deposit policy added.
- Address wording appears before payment.
- Stripe remains the main deposit option.
- Cash App proof upload remains as backup.

## Admin login

```text
Username: kennedywoods
Password: dollhousehairinc
```

Change these in `.env` before publishing if you want.

## Required live settings

Add these as environment variables on Render or your hosting provider:

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
BUSINESS_ADDRESS=
PUBLIC_SITE_URL=
ADMIN_USERNAME=kennedywoods
ADMIN_PASSWORD=dollhousehairinc
```

## Run locally

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```


## AI-assisted Cash App screenshot review

This site can optionally review Cash App proof screenshots with AI.

Add these environment variables:

```text
OPENAI_API_KEY=
AI_REVIEW_ENABLED=true
AI_REVIEW_MODEL=gpt-4o-mini
```

Important: AI cannot guarantee a screenshot is real. It only checks visible clues like:
- expected Cash App tag
- expected deposit amount
- completed payment wording
- suspicious/missing details

If the screenshot is unclear or suspicious, the admin dashboard marks it for manual review. The address is only texted automatically if the screenshot looks valid. Otherwise, you can approve it in `/admin` after checking your real Cash App activity.


## Real service durations added

Each size/option now has its own `durationMinutes` value inside:

```text
public/script.js
```

The calendar uses the selected service duration before showing available times, so longer services block longer appointment windows.


## Custom duration update

Updated service durations based on your latest list. For duration ranges, the calendar uses the longer end of the range to avoid overbooking:
- Small knotless: 7 hours
- Extra small knotless: 9 hours
- Small island twists: 8 hours
- Extra small island twists: 10 hours
- Large scalp braids ranges use the longer time where a range was provided
