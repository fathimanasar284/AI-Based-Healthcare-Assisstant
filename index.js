// index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { PORT, URI } from "./config.js";
import App from "./routes/routes.js";
import { app, server } from "./routes/socket.js";

// Middleware for server
app.use(cors());
app.disable("x-powered-by"); // Reduce fingerprinting
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect database
mongoose.connect(URI)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

// Configure routes
app.use(App);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
