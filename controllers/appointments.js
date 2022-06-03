const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const moment = require('moment');

// models
const Appointment = require('../models/Appointment');

// @desc      Delete appointment
// @route     DELETE /api/v1/appointments/:id
// @access    Private
exports.deleteAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)

  if (!appointment) {
    return next(
      new ErrorResponse(`No appointment with the id of ${req.params.id}`, 404)
    );
  }

  // @todo Make sure appointment belongs to user or user is admin

  // make sure the appointment is in the future
  const nowUtc = moment.utc()
  const appointmentIsPast = nowUtc.diff(appointment.appointmentDateTime, 'minutes') > 0
  if (appointmentIsPast) {
    return next(
      new ErrorResponse(`Can not be deleted. The appointment time has past.`, 404)
    );
  }

  await appointment.remove()

  res.status(200).json({
    success: true,
    data: {}
  });
});
