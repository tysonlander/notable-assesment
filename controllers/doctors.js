const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const doctors = require('../_data/doctors');
const appointments = require('../_data/appointments');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

// uuidv4();

// @desc      Get doctors
// @route     GET /api/v1/doctors
// @access    Public
exports.getDoctors = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: doctors,
  });
});

// @desc      Get Appointments
// @route     GET /api/v1/doctors/:doctorId/appointments
// @access    Public
exports.getAppointmentsByDoctor = asyncHandler(async (req, res, next) => {
  const { doctorId } = req.params;
  const { appointmentDateStr } = req.query;
  const appointmentDate = moment(appointmentDateStr).format('DD-MM-YYYY');

  const data = appointments.filter((appointment) => {
    return (
      appointment.doctor_id === doctorId &&
      moment(appointment.date_time).format('DD-MM-YYYY') === appointmentDate
    );
  });

  return res.status(200).json({
    success: true,
    count: data.length,
    data: data,
  });
});

// @desc      Get Appointments
// @route     GET /api/v1/doctors/:doctorId/appointments
// @access    Public
exports.createAppointment = asyncHandler(async (req, res, next) => {
  const { doctorId } = req.params;

  const appointmentDateTime = moment(req.body.date_time);
  // @todo
  // validate the datetime is on a 15 min increment
  // validate the doctor is available having no more than 2 existing appointment at that datetime
  // validate kind with an enum

  const newAppt = {
    id: uuidv4(),
    doctor_id: doctorId,
    date_time: appointmentDateTime,
    patient: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    },
    kind: req.body.kind,
  };

  appointments.push(newAppt);

  // return a list of appointments on the created date
  const appointmentDateNoTime =
    moment(appointmentDateTime).format('DD-MM-YYYY');
  const data = appointments.filter((appointment) => {
    return (
      appointment.doctor_id === doctorId &&
      moment(appointment.date_time).format('DD-MM-YYYY') ===
        appointmentDateNoTime
    );
  });

  return res.status(200).json({
    success: true,
    count: data.length,
    data: data,
  });
});
