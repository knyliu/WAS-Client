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
  const appointment = new AppointmentsModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    members: req.body.members,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    appointmentTime: req.body.appointmentTime,
    userOwner: req.body.userOwner,
  });
  console.log(appointment);

  try {
    const result = await appointment.save();
    res.status(201).json({
      createdAppointment: {
        name: result.name,
        description: result.description,
        image: result.image,
        members: result.members,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } 
  catch (err) {
    // console.log(err);
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


// Update
router.put("/appointments/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await AppointmentsModel.findById(id); // 修改这行代码，确保使用正确的 id
    if (!appointment) {
      return res.status(404).send("Appointment!! not!! found!!");
    }
    else{
      res.status(404).send("Awesome!!");
    }

    // 更新字段
    appointment.name = req.body.name || appointment.name;
    appointment.description = req.body.description || appointment.description;
    appointment.members = req.body.members || appointment.members;
    appointment.instructions = req.body.instructions || appointment.instructions;
    appointment.imageUrl = req.body.imageUrl || appointment.imageUrl;
    appointment.appointmentTime = req.body.appointmentTime || appointment.appointmentTime;
    appointment.userOwner = req.body.userOwner || appointment.userOwner;

    const updatedAppointment = await appointment.save();
    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete an appointment by ID
router.delete("/:appointmentId", verifyToken, async (req, res) => {
  try {
    const result = await AppointmentsModel.findByIdAndDelete(req.params.appointmentId);
    if (!result) {
      return res.status(404).send("Appointment not found.");
    }
    res.status(200).send("Appointment deleted successfully.");
  } catch (err) {
    res.status(500).json(err);
  }
});


export { router as appointmentsRouter }; // export the router
