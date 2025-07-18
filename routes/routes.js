import express from "express"; // import the express module
import Auth from "./auth.js"; //import auth
import { Verify } from "../middleware/verify.js";
import path from "path";
import { fileURLToPath } from "url";

import HealthTracking from "../models/HealthTrackingSchema.js";


// Function to get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Create an app object

app.disable("x-powered-by"); // Reduce fingerprinting (optional)
// home route with the get method and a handler
app.use("/auth", Auth);

app.use(express.static("public"));

app.use("/user", Verify, express.static("dashboard"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// POST route to add a new health tracking record
app.post('/healthtracking', Verify, async (req, res) => {
    try {
        const { sugarLevel, systolic, diastolic } = req.body;
        const userId = req.user._id;

        // Create a new health tracking record
        const newRecord = new HealthTracking({
            user: userId,
            sugarLevel,
            systolic,
            diastolic
        });

        // Save the record to the database
        await newRecord.save();

        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create health tracking record' });
    }
});

// GET route to fetch the latest 10 health tracking records for the logged-in user
app.get('/healthtracking', Verify, async (req, res) => {
  try {
      const userId = req.user._id;

      // Fetch the latest 10 health tracking records for the user
      const records = await HealthTracking.find({ user: userId })
          .sort({ recordedAt: -1 })
          .limit(10);
      res.status(200).json(records);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch health tracking records' });
  }
});




export default app;
