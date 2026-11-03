# Pulse Fitness

A modern, responsive fitness website where users can explore fitness classes, view schedules, discover trainers, register or log in, contact the team and purchase fitness class passes online.

## Live Project

- **Live Website:** https://pulse-fitness-pied.vercel.app/
- **Backend API:** https://pulse-fitness-01j6.onrender.com
- **GitHub Repository:** https://github.com/mrbrunonuno/Pulse-Fitness

## Project Features

### 1. Homepage
- Responsive homepage design.
- Fitness class information.
- Clear navigation between website sections.

### 2. Header and Navigation
- Responsive desktop and mobile navigation.
- Sticky header.
- Mobile hamburger menu.
- Smooth mobile menu animations.
- Animated desktop navigation underline.
- Keyboard-accessible navigation.
- Links to Classes, Schedule, Trainers, About and Contact.

### 3. Fitness Classes and Schedule
- Displays available fitness classes.
- Shows class names, trainers, durations and schedules.
- Responsive layout for desktop and mobile.
- Class booking functionality.

### 4. Trainers
- Trainer profiles and information.
- Associated fitness classes.
- Responsive trainer cards.

### 5. About Us
- Introduction to Pulse Fitness.
- Mission, Community and Goals sections.
- Fitness imagery with descriptive alternative text.

### 6. Contact Us
- Responsive Contact Us section.
- Contact form with Name, Email, Subject and Message fields.
- Form validation.
- Success and error feedback.
- Contact messages stored in Neon PostgreSQL.
- Backend endpoint: `/api/contact`.

### 7. User Authentication
- User registration.
- User login.
- Session-based authentication.
- Login session verification.
- Logout functionality.

### 8. Online Payments
- Stripe Checkout integration.
- Fitness class pass purchases.
- Order creation and tracking.
- Stripe webhook integration.
- Payment confirmation and order status updates.

### 9. Footer
- Responsive footer design.
- Quick navigation links.
- Explore Classes call-to-action.
- Hover effects and keyboard focus styling.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Neon |
| Payments | Stripe Checkout, Stripe Webhooks |
| Deployment | Vercel, Render |
| Version Control | Git, GitHub |
| Development | Visual Studio Code |

## Database

Pulse Fitness uses PostgreSQL hosted through Neon.

Database functionality includes:

- User accounts
- Fitness classes
- Bookings
- Orders
- Order items
- User sessions
- Contact messages

Contact form submissions are stored in the `contact_messages` table.

## Project Structure

```text
Pulse-Fitness/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.local
│
├── server/
│   ├── index.js
│   ├── seed.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Local Development Setup

### Requirements

- Node.js and npm
- Git
- Visual Studio Code
- Neon PostgreSQL database
- Stripe account for payment testing

### 1. Clone the repository

```bash
git clone https://github.com/mrbrunonuno/Pulse-Fitness.git
cd Pulse-Fitness
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Configure frontend environment

Create a `.env.local` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the frontend

From the `client` folder:

```bash
npm run dev
```

### 5. Install backend dependencies

Open another terminal from the project root:

```bash
cd server
npm install
```

Configure the required backend environment variables in the server's local `.env` file. These include the database connection and the required authentication and Stripe configuration.

### 6. Start the backend

From the `server` folder:

```bash
node index.js
```

The backend runs locally on port `5000`.

**Security:** Never upload `.env` files, passwords, database credentials, Stripe secret keys or other private credentials to GitHub.

## Payment Testing

Stripe test mode was used to test the checkout process.

Test card:

- **Card number:** `4242 4242 4242 4242`
- **Expiry date:** Any future date
- **CVC:** Any three digits

These are simulated test payments and do not represent real transactions.

## Deployment

| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Neon | PostgreSQL database |
| Stripe | Checkout and payment processing |
| GitHub | Source code and version control |

## Testing and Quality Assurance

The project is tested and improved across the following areas:

- Desktop and mobile responsiveness.
- Navigation and mobile menu functionality.
- Keyboard accessibility.
- Fitness class and schedule display.
- User registration and login.
- Contact form validation and database storage.
- Stripe checkout and payment confirmation.
- Backend API functionality.

Build verification is performed using:

```bash
npm run build
```

## Developer

**Bruno Nunes**

Pulse Fitness – Fitness Website Project

Built using React, Tailwind CSS, Node.js, Express and PostgreSQL.