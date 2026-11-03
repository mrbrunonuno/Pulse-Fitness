# Pulse Fitness

A responsive fitness website that helps users explore fitness classes, view schedules, learn about the gym, contact the team and purchase class passes online.

## Live Website

- **Frontend:** https://pulse-fitness-pied.vercel.app/
- **Backend API:** https://pulse-fitness-01j6.onrender.com
- **GitHub Repository:** https://github.com/mrbrunonuno/Pulse-Fitness

## Features

### Homepage
- Responsive homepage layout.
- Fitness class information.
- Clear navigation to the main website sections.

### Header and Navigation
- Responsive desktop and mobile navigation.
- Sticky header.
- Mobile hamburger menu.
- Smooth mobile menu opening and closing animation.
- Navigation menu closes after selecting a link.
- Animated underline effects on desktop navigation.
- Keyboard-accessible navigation controls.
- Quick links to Classes, Schedule, Trainers, About and Contact.

### Class Schedule
- Displays available fitness classes.
- Shows class names, trainers, durations and schedules.
- Responsive table layout for smaller screens.
- Improved mobile text sizing and column spacing.

### Trainers
- Displays fitness trainer profiles.
- Includes trainer information and associated fitness classes.
- Responsive trainer card layout.

### About Section
- Introduction to Pulse Fitness.
- Our Mission, Our Community and Our Goal cards.
- Fitness image with descriptive alternative text.
- Purple branding and interactive hover effects.

### Contact Us
- Modern, responsive Contact Us section.
- Premium dark-purple design with gradient accents.
- Contact form with Name, Email, Subject and Message fields.
- Required field validation and input length limits.
- Form submission feedback for success and errors.
- Contact messages saved to Neon PostgreSQL.
- Backend API endpoint: `/api/contact`.

### Footer
- Responsive footer layout.
- Brand information and quick navigation links.
- Call-to-action button.
- Interactive hover effects and keyboard focus styling.

### Authentication
- User registration and login.
- Session-based authentication.
- Authentication check through the `/api/auth/me` endpoint.

### Online Payments
- Stripe Checkout integration.
- Purchase fitness class passes.
- Payment confirmation and order details.
- Stripe webhook integration for payment status updates.

## Technology Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- PostgreSQL
- Neon Database

**Payments**
- Stripe Checkout
- Stripe Webhooks

**Development and Deployment**
- Git and GitHub
- Visual Studio Code
- Vercel (frontend)
- Render (backend)

## Database

The application uses PostgreSQL hosted through Neon.

Database functionality includes:
- User accounts
- Fitness classes
- Bookings
- Orders
- Order items
- User sessions
- Contact messages

Contact messages are stored in the `contact_messages` table with a unique ID, name, email, subject, message, status and submission date.

## Local Development Setup

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

### 5. Install and start the backend

Open another terminal from the project root:

```bash
cd server
npm install
node index.js
```

Configure the required backend environment variables in a local `.env` file before starting the server.

Never commit passwords, database credentials, API keys or secret values to GitHub.

## Payment Testing

Stripe test mode was used to verify the checkout process.

**Test card:**

- Card number: `4242 4242 4242 4242`
- Expiry date: Any future date
- CVC: Any three digits

Payments made with this test card are simulated and do not represent real transactions.

## Deployment

| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Neon | PostgreSQL database |
| Stripe | Test checkout and payment processing |
| GitHub | Source code and version control |

## Testing and Quality Improvements

The project includes ongoing improvements to:

- Responsive layouts across desktop and mobile.
- Navigation and keyboard accessibility.
- Mobile menu behaviour.
- Class schedule readability.
- Interactive hover effects and animations.
- Contact form validation and database storage.
- Authentication and session handling.
- Stripe checkout and payment confirmation.

Changes are tested before being committed to help protect existing functionality.

## Developer

**Bruno Nunes**

Pulse Fitness – Fitness Website Project