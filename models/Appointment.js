const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientFirstName: {
    type: String,
    required: [true, 'Please add a patient first name'],
    trim: true,
  },
  patientLastName: {
    type: String,
    required: [true, 'Please add a patient last name'],
    trim: true,
  },
  appointmentDateTime: {
    type: Date,
    required: [true, 'Please add an appointment time.'],
  },
  kind: {
    type: String,
    required: [
      true,
      'Please add an appointment type ("New Patient", "Follow-up")',
    ],
    enum: ['New Patient', 'Follow-up'],
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor',
    required: true,
  },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
