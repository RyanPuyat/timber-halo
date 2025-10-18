# 🌲 Timber Halo: Crafting a Custom Hotel Management App for a Boutique Experience

**Timber Halo** is a small boutique hotel tucked away in nature, with just eight cozy wooden cabins. It’s all about giving guests a peaceful, personalized experience—but behind the scenes, there’s a lot to manage: bookings, check-ins, cabin details, and guest info.

So I’ve started building a custom internal app for the hotel. It’s designed specifically for the staff to handle everything smoothly and efficiently. This isn’t just another side project—it’s becoming the digital heartbeat of Timber Halo.


### 🔐 Authentication & User Management
- Only hotel employees can sign up (no public registration)
- Secure login required for all actions
- Profile management: avatar upload, name and password updates

### 🏡 Cabin Management
- Table view of all cabins with:
  - Photo, name, capacity, price, and current discount
- Create, update, or delete cabins (with photo uploads)

### 📆 Booking Management
- Table view of all bookings with:
  - Arrival/departure dates
  - Status: `unconfirmed`, `checked in`, `checked out`
  - Paid amount, cabin info, guest info
- Filter bookings by status
- Additional booking data:
  - Number of guests
  - Number of nights
  - Guest observations
  - Breakfast inclusion and price
- Booking actions:
  - Delete, check-in, or check-out (no editing)
  - Accept payment externally, confirm payment internally
  - Add breakfast at check-in if not already included

### 🧍 Guest Profiles
- Full name, email, national ID, nationality
- Country flag for quick identification

### 📊 Dashboard Overview
- Guests checking in/out today (with actionable buttons)
- Stats for last 7, 30, and 90 days:
  - Bookings, sales, check-ins, occupancy rate
- Charts:
  - Stay duration trends
  - Daily sales breakdown (total vs. extras like breakfast)

### ⚙️ App Settings
- Define breakfast price
- Set min/max nights per booking
- Set max guests per booking

### 💬 Messaging System
- Send/delete messages (text, files, images)
- Download attachments
- Internal communication between staff

### 🌙 UI Features
- Dark mode toggle for night shifts or personal preference
