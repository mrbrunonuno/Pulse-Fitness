import Stripe from "stripe";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("./.env", import.meta.url)),
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;