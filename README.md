# Subscription Fatigue Tracker
🔗 [Live Demo](https://your-project.vercel.app)

A capstone project for **Software Product Development (STY-4040)** — Cambrian College, IT Business Analysis Semester 2.

A full-stack web app that helps users log, track, and manage their recurring subscriptions with a live monthly cost dashboard.

## About

Subscription services are easy to sign up for and easy to forget. Without a way to track them all in one place, costs quietly add up in the background. The Subscription Fatigue Tracker gives users a clear view of every recurring charge and what they're spending each month — making it easy to spot what's worth keeping and what isn't.

---

## Features

- **Authentication** — secure sign up, log in, and log out via Supabase Auth
- **Add subscriptions** — log a subscription with name, cost, billing cycle, category, and next billing date
- **Delete subscriptions** — remove subscriptions you no longer need
- **Dashboard** — view all active subscriptions and your total estimated monthly spend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend / Database | Supabase (PostgreSQL + Auth) |
| Hosting | Vercel |

---

## Project Structure

```
src/
├── lib/
│   └── supabase.js
├── pages/
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   └── Dashboard.jsx
├── components/
│   ├── Navbar.jsx
│   ├── SubscriptionForm.jsx
│   ├── SubscriptionList.jsx
│   └── SubscriptionCard.jsx
├── App.jsx
└── main.jsx
```


---

## Course Info

**Course:** Software Product Development — STY-4040  
**Program:** IT Business Analysis
**College:** Cambrian College  
**Semester:** 2
