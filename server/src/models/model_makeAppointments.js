import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
  appointmentInputs: {
    type: Object,
    required: true
  }
});

export const makeAppointmentsModel = mongoose.model("client_appointments", appointmentSchema);
