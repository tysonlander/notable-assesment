// models
const Appointment = require('../models/Appointment');

const isDoctorAvailable = async (doctorId, dateTime) => {
  let available = true
  let message = ""
    const overLappingAppointments = await Appointment.find({
    doctor: doctorId,
    appointmentDateTime: dateTime,
  });

  if(overLappingAppointments.length > 2){
      available = false
      message = "There is no more availability for this doctor at the specified time."
  }

  return {available, message}

};

module.exports = { isDoctorAvailable };
