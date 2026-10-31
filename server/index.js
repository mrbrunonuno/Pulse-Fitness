
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pool from "./db.js";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("./.env", import.meta.url)),
});

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";
const PgSession = connectPgSimple(session);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
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

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Pulse Fitness API is running!" });
});

// Health-check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is healthy" });
});

// Get all fitness classes
app.get("/api/classes", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        title,
        category,
        intensity,
        difficulty,
        duration,
        trainer,
        spots_left AS "spotsLeft",
        rating,
        description,
        schedule
      FROM fitness_classes
      ORDER BY id ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch fitness classes:", error.message);
    res.status(500).json({
      message: "Failed to retrieve fitness classes",
    });
  }
});


 // Create a booking
app.post("/api/bookings", async (req, res) => {
  console.log("POST /api/bookings route reached!");
  console.log("Session ID:", req.sessionID);
  console.log("Session user ID:", req.session.userId);
  console.log("Cookie received:", req.headers.cookie);

  // 1. Check whether the user is logged in
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Please log in before reserving a spot.",
    });
  }

  const { classId, quantity } = req.body;

  // 2. Validate the booking details
  const parsedClassId = Number(classId);
  const parsedQuantity = Number(quantity);

  if (
    !Number.isInteger(parsedClassId) ||
    parsedClassId <= 0 ||
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity <= 0 ||
    parsedQuantity > 20
  ) {
    return res.status(400).json({
      message: "Please provide a valid class and quantity (1–20).",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 3. Lock the class row so simultaneous bookings cannot
    // reserve the same remaining spots.
    const classResult = await client.query(
      `SELECT id, title, spots_left
       FROM fitness_classes
       WHERE id = $1
       FOR UPDATE`,
      [parsedClassId]
    );

    if (classResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Fitness class not found.",
      });
    }

    const fitnessClass = classResult.rows[0];

    if (Number(fitnessClass.spots_left) < parsedQuantity) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "Not enough spots available for this class.",
      });
    }

    // 4. Save the booking for the logged-in user
    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, class_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, class_id, quantity, booking_date, status`,
      [req.session.userId, parsedClassId, parsedQuantity]
    );

    // 5. Reduce the available spots
    await client.query(
      `UPDATE fitness_classes
       SET spots_left = spots_left - $1
       WHERE id = $2`,
      [parsedQuantity, parsedClassId]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Booking created successfully.",
      booking: bookingResult.rows[0],
      classTitle: fitnessClass.title,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Booking error:", error.message);

    res.status(500).json({
      message: "Unable to create booking. Please try again.",
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

app.listen(PORT, () => {
  console.log(`Pulse Fitness API running on port ${PORT}`);
});
