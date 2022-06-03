const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const moment = require('moment');
const { isOn15MinIncrement, clearTimeAfterMin } = require('../utils/timeUtils');
const {isDoctorAvailable} = require('../utils/doctorUtils')

// models
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc      Get doctors
// @route     GET /api/v1/doctors
// @access    Public
exports.getDoctors = asyncHandler(async (req, res, next) => {
  const doctorsInDb = await Doctor.find();

  res.status(200).json({
    success: true,
    count: doctorsInDb.length,
    data: doctorsInDb,
  });
});

// @desc      Create doctor
// @route     POST /api/v1/doctors
// @access    Public
exports.createDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.create(req.body);

  res.status(201).json({
    success: true,
    data: doctor,
  });
});

// @desc      Get Appointments
// @route     GET /api/v1/doctors/:doctorId/appointments
// @access    Public
// @Parameters
//    appointmentStart: the UTC date
//    appointmentEnd: the UTC date
exports.getAppointmentsByDoctor = asyncHandler(async (req, res, next) => {
  const { doctorId } = req.params;
  const { appointmentStart, appointmentEnd } = req.query;
  if (!appointmentStart || !appointmentEnd) {
    return next(
      new ErrorResponse(
        `Parameters "appointmentStart" and "appointmentEnd" are required`,
        400
      )
    );
  }

  const appointmentStartDate = moment(appointmentStart).format('DD-MM-YYYY');
  const appointmentEndDate = moment(
    moment(appointmentEnd).format('DD-MM-YYYY')
  ).add(1, 'days'); // one day added for mongoose less than query

  const data = await Appointment.find({
    doctor: doctorId,
    appointmentDateTime: {
      $gte: appointmentStartDate,
      $lt: appointmentEndDate,
    },
  });

  return res.status(200).json({
    success: true,
    count: data.length,
    data: data,
  });
});

// @desc      Create an Appointment
// @route     GET /api/v1/doctors/:doctorId/appointments
// @access    Public
exports.createAppointment = asyncHandler(async (req, res, next) => {
  // Note:  "kind" is validated with an enum on the Appointment model

  // validate the datetime is on a 15 min increment
  req.body.appointmentDateTime = moment(req.body.appointmentDateTime);
  if (!isOn15MinIncrement(req.body.appointmentDateTime)) {
    const hour = req.body.appointmentDateTime.hour();
    return next(
      new ErrorResponse(
        `The appointment time is invalid. Appointments must be scheduled starting on the hour or on a quarter of the hour (${hour}:00, ${hour}:15, ${hour}:30, ${hour}:45)`,
        400
      )
    );
  }
  // set zero time after minutes
  clearTimeAfterMin(req.body.appointmentDateTime)
  

  const { doctorId } = req.params;
  req.body.doctor = doctorId;

  const doctorAvailableResp = await isDoctorAvailable(doctorId, req.body.appointmentDateTime) 
  if (!doctorAvailableResp.available) {
    return next(
      new ErrorResponse(
        doctorAvailableResp.message,
        400
      )
    );
  }
  
  const appointment = await Appointment.create(req.body);

  return res.status(201).json({
    success: true,
    data: appointment,
  });
});
