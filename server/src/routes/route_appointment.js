import express from "express";
import mongoose from "mongoose";

import { AppointmentsModel } from "../models/model_Appointments.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";
import { makeAppointmentsModel } from "../models/model_makeAppointments.js";


const router = express.Router(); // create router

// Read - See all the stores
router.get("/", async (req, res) => {
  try {
    const result = await AppointmentsModel.find({});
    res.status(200).json(result);
  } 
  catch (err) {
    res.status(500).json(err);
  }
});

// Read - See all the appointments
router.get("/client_appointments", async (req, res) => {
  try {
    const userID = req.params.userID;
    const result = await makeAppointmentsModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Create - Create a new appointment
router.post("/", verifyToken, async (req, res) => {
  const appointment = new makeAppointmentsModel({
    _id: new mongoose.Types.ObjectId(),
    appointmentInputs: req.body.appointmentInputs,
  });
  console.log(appointment);

  try {
    const result = await appointment.save();
    res.status(201).json({
      createdAppointment: {
        appointmentInputs: result.appointmentInputs,
        _id: result._id,
      },
    });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get an appointment by ID
router.get("/:AppointmentId", async (req, res) => {
  try {
    const result = await AppointmentsModel.findById(req.params.AppointmentId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save an Appointment
router.put("/", async (req, res) => {
  // console.log(req.body.appointmentID);
  const appointment = await AppointmentsModel.findById(req.body.appointmentID);
  const user = await UserModel.findById(req.body.userID); // who is saving the appointment

  try {
    user.savedAppointments.push(appointment);
    await user.save(); // save the appointment
    res.status(201).json({ savedAppointments: user.savedAppointments });
  } 
  catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved appointments
router.get("/savedAppointments/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedAppointments: user?.savedAppointments });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved appointments
router.get("/savedAppointments/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedAppointments = await AppointmentsModel.find({
      _id: { $in: user.savedAppointments },
    });
    console.log(savedAppointments);
    res.status(201).json({ savedAppointments });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as appointmentsRouter }; // export the router
