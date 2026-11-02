# Pulse Fitness 🏋️

A responsive fitness class booking platform where users can explore fitness classes, create accounts, reserve spots and securely purchase class passes using Stripe Checkout.

**Live Website:** https://pulse-fitness-pied.vercel.app/

**Backend API:** https://pulse-fitness-01j6.onrender.com

**GitHub Repository:** https://github.com/mrbrunonuno/Pulse-Fitness

---

## 🚀 Features

- Responsive fitness website built with React and Tailwind CSS.
- Browse fitness classes and filter by category.
- View class descriptions, trainers, ratings, prices and available spots.
- User registration and login.
- Session-based authentication.
- Reserve fitness class spots.
- Select the number of passes to purchase.
- Stripe Checkout integration using test mode.
- Secure payment confirmation through Stripe webhooks.
- Automatic order status updates after successful payment.
- PostgreSQL database integration using Neon.
- Order confirmation page displaying payment details.

## 🛠️ Technologies Used

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript
- HTML5

### Backend
- Node.js
- Express.js
- PostgreSQL
- Neon Database
- Express Session
- Stripe API

### Development & Deployment
- Git and GitHub
- Visual Studio Code
- Vercel (Frontend)
- Render (Backend)
- Stripe Dashboard

## 💳 Stripe Payment Integration

Pulse Fitness uses Stripe Checkout in test mode to process fitness class payments.

The checkout process:

1. User logs into their account.
2. User selects a fitness class and quantity.
3. Backend validates the booking and retrieves the price from the database.
4. An order is created with a pending payment status.
5. User is redirected to Stripe Checkout.
6. Stripe processes the test payment.
7. Stripe sends a verified webhook event to the backend.
8. The order is updated to paid after successful payment.
9. User is redirected to the confirmation page.

**Test card details:**

- Card number: `4242 4242 4242 4242`
- Expiry date: Any future date
- CVC: Any three digits

Only use Stripe test card details for testing.

## 🗄️ Database

The project uses PostgreSQL hosted on Neon.

Main database tables include:

- `users` – stores registered user information.
- `fitness_classes` – stores fitness class information and available spots.
- `bookings` – stores class reservations.
- `orders` – stores payment orders and Stripe references.
- `order_items` – stores the classes and quantities purchased.
- `session` – stores user login sessions.

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/mrbrunonuno/Pulse-Fitness.git
```

### 2. Navigate to the project

```bash
cd Pulse-Fitness
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Configure frontend environment variables

Create a `.env.local` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 6. Configure backend environment variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=your_neon_database_url
SESSION_SECRET=your_session_secret
STRIPE_SECRET_KEY=your_stripe_test_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Never commit your `.env` or `.env.local` files to GitHub.

### 7. Start the backend

From the `server` folder:

```bash
npm run dev
```

### 8. Start the frontend

From the `client` folder:

```bash
npm run dev
```

Open the local development URL displayed by Vite, usually:

http://localhost:5173

## 🌍 Deployment

| Component | Hosting |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |
| Payment gateway | Stripe |

## ✅ Payment Testing

A successful Stripe test transaction was completed and verified.

**Verified test order:**

| Detail | Result |
|---|---|
| Order ID | 11 |
| Fitness class | High-Intensity Interval Training |
| Quantity | 1 |
| Total | R150.00 |
| Currency | ZAR |
| Payment status | Paid |

The order and order items were also verified directly in the Neon PostgreSQL database.

## 👨‍💻 Author

**Bruno Nunes**

GitHub: https://github.com/mrbrunonuno

---

*Pulse Fitness – Train smarter. Get stronger. Live healthier.*