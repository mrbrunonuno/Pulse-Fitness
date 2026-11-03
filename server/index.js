
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pool from "./db.js";
import { fileURLToPath } from "node:url";
import stripe from "./stripe.js";

dotenv.config({
  path: fileURLToPath(new URL("./.env", import.meta.url)),
});

const app = express();

app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";
const PgSession = connectPgSimple(session);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pulse-fitness-pied.vercel.app",
    ],
    credentials: true,
  })
);

// Stripe webhook - verify payments
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error("Stripe webhook signature error:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
      
if (event.type === "checkout.session.completed") {
  const checkoutSession = event.data.object;
  const orderId = checkoutSession.metadata.orderId;

  if (checkoutSession.payment_status === "paid" && orderId) {
    await pool.query(
      `UPDATE orders
       SET status = 'paid',
           stripe_payment_intent_id = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
         AND stripe_session_id = $3
         AND status = 'pending'`,
      [
        checkoutSession.payment_intent,
        orderId,
        checkoutSession.id,
      ]
    );

    console.log(`Order ${orderId} marked as paid.`);
  }
}


if (event.type === "checkout.session.expired") {
  const checkoutSession = event.data.object;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Only expire an order that is still pending
    const result = await client.query(
      `UPDATE orders
       SET status = 'expired',
           updated_at = CURRENT_TIMESTAMP
       WHERE stripe_session_id = $1
         AND status = 'pending'
       RETURNING id`,
      [checkoutSession.id]
    );

    // Restore spots only if this order was just expired
    if (result.rows.length > 0) {
      const orderId = result.rows[0].id;

      const itemsResult = await client.query(
        `SELECT class_id, quantity
         FROM order_items
         WHERE order_id = $1`,
        [orderId]
      );

      for (const item of itemsResult.rows) {
        await client.query(
          `UPDATE fitness_classes
           SET spots_left = spots_left + $1
           WHERE id = $2`,
          [item.quantity, item.class_id]
        );
      }

      console.log(`Order ${orderId} expired. Class spots restored.`);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}


       res.json({ received: true });
    } catch (error) {
      console.error("Webhook processing error:", error.message);
      res.status(500).json({ message: "Webhook processing failed." });
    }
  }
);

app.use(express.json());

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: false,
    }),
    name: "pulse.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Get all available fitness classes
app.get("/api/classes", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         title,
         category,
         intensity,
         duration,
         trainer,
         spots_left AS "spotsLeft",
         rating,
         description,
         price
       FROM fitness_classes
       ORDER BY id ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch classes error:", error.message);

    res.status(500).json({
      message: "Unable to retrieve fitness classes.",
    });
  }
});

// Check whether the customer is logged in
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Please log in before making a purchase.",
    });
  }

  next();
}


// Create a Stripe Checkout Session
app.post("/api/checkout", requireAuth, async (req, res) => {
  const classId = Number(req.body.classId);
  const quantity = Number(req.body.quantity);

  // Validate the customer's selection
  if (
    !Number.isInteger(classId) ||
    classId <= 0 ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    quantity > 20
  ) {
    return res.status(400).json({
      message: "Please select a valid class and quantity.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock the class row to prevent overselling
    const classResult = await client.query(
      `SELECT id, title, price, spots_left
       FROM fitness_classes
       WHERE id = $1
       FOR UPDATE`,
      [classId]
    );

    if (classResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Fitness class not found.",
      });
    }

    const fitnessClass = classResult.rows[0];

    if (Number(fitnessClass.spots_left) < quantity) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "Not enough spots available.",
      });
    }

    const unitPrice = Number(fitnessClass.price);
    const totalAmount = unitPrice * quantity;
    const amountInCents = Math.round(unitPrice * 100);

    if (
      !Number.isSafeInteger(amountInCents) ||
      amountInCents <= 0 ||
      !Number.isFinite(totalAmount)
    ) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Invalid class price.",
      });
    }

    // Create the pending order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, currency, status)
       VALUES ($1, $2, 'zar', 'pending')
       RETURNING id`,
      [req.session.userId, totalAmount]
    );

    const orderId = orderResult.rows[0].id;

    // Save the order item
    await client.query(
      `INSERT INTO order_items
       (order_id, class_id, class_title, quantity, unit_price, subtotal)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        orderId,
        classId,
        fitnessClass.title,
        quantity,
        unitPrice,
        totalAmount,
      ]
    );

    // Reserve the class spots
    await client.query(
      `UPDATE fitness_classes
       SET spots_left = spots_left - $1
       WHERE id = $2`,
      [quantity, classId]
    );

    // Create the Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "zar",
            product_data: {
              name: fitnessClass.title,
            },
            unit_amount: amountInCents,
          },
          quantity: quantity,
        },
      ],

      client_reference_id: String(orderId),

      metadata: {
        orderId: String(orderId),
        userId: String(req.session.userId),
      },

      success_url: `${process.env.CLIENT_URL}/?checkout=success&order_id=${orderId}`,

      cancel_url: `${process.env.CLIENT_URL}/?checkout=cancelled`,
    });

    // Link the Stripe session to the order
    await client.query(
      `UPDATE orders
       SET stripe_session_id = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [checkoutSession.id, orderId]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Checkout session created successfully.",
      checkoutUrl: checkoutSession.url,
      orderId: orderId,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Stripe checkout error:", error.message);

    res.status(500).json({
      message: "Unable to start checkout. Please try again.",
    });
  } finally {
    client.release();
  }
});


// Sign up
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Enter your name, a valid email, and a password of at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name.trim(), normalizedEmail, passwordHash]
    );

    const user = result.rows[0];

    req.session.userId = user.id;

    req.session.save((error) => {
      if (error) {
        console.error("Signup session error:", error.message);
        return res.status(500).json({ message: "Account created, but login session failed." });
      }

      res.status(201).json({
        message: "Account created successfully.",
        user,
      });
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Unable to create account." });
  }
});

// Log in
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Enter your email and password.",
      });
    }

    const result = await pool.query(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    req.session.userId = user.id;

    req.session.save((error) => {
      if (error) {
        console.error("Login session error:", error.message);
        return res.status(500).json({ message: "Unable to create login session." });
      }

      res.json({
        message: "Login successful.",
        user: { id: user.id, name: user.name, email: user.email },
      });
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Unable to log in." });
  }
});

// Get the currently logged-in user
app.get("/api/auth/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "You are not logged in." });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.session.userId]
    );

    if (!result.rows[0]) {
      return req.session.destroy(() => {
        res.status(401).json({ message: "User account not found." });
      });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Current-user error:", error.message);
    res.status(500).json({ message: "Unable to retrieve user." });
  }
});


// Get bookings for the logged-in user
app.get("/api/bookings", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Please log in to view your bookings.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT
         b.id,
         b.class_id AS "classId",
         b.quantity,
         b.booking_date AS "bookingDate",
         b.status,
         fc.title AS "className",
         fc.category,
         fc.trainer
       FROM bookings b
       JOIN fitness_classes fc ON fc.id = b.class_id
       WHERE b.user_id = $1
       ORDER BY b.booking_date DESC`,
      [req.session.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch bookings error:", error.message);

    res.status(500).json({
      message: "Unable to retrieve your bookings.",
    });
  }
});

// Cancel a booking
app.patch("/api/bookings/:id/cancel", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Please log in to cancel a booking.",
    });
  }

  const bookingId = Number(req.params.id);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return res.status(400).json({
      message: "Invalid booking ID.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Find and lock this user's booking
    const bookingResult = await client.query(
      `SELECT id, class_id, quantity, status
       FROM bookings
       WHERE id = $1 AND user_id = $2
       FOR UPDATE`,
      [bookingId, req.session.userId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    const booking = bookingResult.rows[0];

    if (booking.status === "cancelled") {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "This booking has already been cancelled.",
      });
    }

    // Restore the available class spots
    await client.query(
      `UPDATE fitness_classes
       SET spots_left = spots_left + $1
       WHERE id = $2`,
      [booking.quantity, booking.class_id]
    );

    // Update the booking status
    await client.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE id = $1`,
      [bookingId]
    );

    await client.query("COMMIT");

    res.json({
      message: "Booking cancelled successfully.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Cancellation error:", error.message);

    res.status(500).json({
      message: "Unable to cancel booking.",
    });
  } finally {
    client.release();
  }
});

// Log out
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error.message);
      return res.status(500).json({ message: "Unable to log out." });
    }

    res.clearCookie("pulse.sid");
    res.json({ message: "Logged out successfully." });
  });
});

// Get a specific order belonging to the logged-in user
app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const orderId = Number(req.params.id);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({
      message: "Invalid order ID.",
    });
  }

  try {
    const orderResult = await pool.query(
      `SELECT
         id,
         user_id,
         total_amount,
         currency,
         status,
         created_at
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [orderId, req.session.userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const itemsResult = await pool.query(
      `SELECT
         class_id,
         class_title,
         quantity,
         unit_price,
         subtotal
       FROM order_items
       WHERE order_id = $1`,
      [orderId]
    );

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Order lookup error:", error.message);

    res.status(500).json({
      message: "Unable to retrieve order.",
    });
  }
});

// Submit a Contact Us message
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Please complete all fields.",
      });
    }

    // Validate field lengths
    if (
      name.trim().length > 100 ||
      email.trim().length > 255 ||
      subject.trim().length > 200 ||
      message.trim().length > 5000
    ) {
      return res.status(400).json({
        message: "One or more fields exceed the allowed length.",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    // Save message in Neon PostgreSQL
    const result = await pool.query(
      `INSERT INTO contact_messages
        (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        subject.trim(),
        message.trim(),
      ]
    );

    res.status(201).json({
      message: "Your message has been submitted successfully.",
      contact: result.rows[0],
    });
  } catch (error) {
    console.error("Contact form error:", error.message);

    res.status(500).json({
      message: "Unable to submit your message. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Pulse Fitness API running on port ${PORT}`);
});
