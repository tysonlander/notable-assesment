const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const appointments = require('../_data/appointments');
const momemt = require('moment')
const { v4: uuidv4 } = require('uuid');

// uuidv4();

// @desc      Delete appointment
// @route     DELETE /api/v1/appointments/:id
// @access    Private
exports.deleteAppointment = asyncHandler(async (req, res, next) => {
  const appointment = appointments.find(appt => appt.id === req.params.id)

  if (!appointment) {
    return next(
      new ErrorResponse(`No appointment with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure appointment belongs to user or user is admin
  // @todo

  // make sure the review is in the future
  const nowUtc = moment.utc().valueOf()
  const appointmentIsPast = nowUtc.diff(appointment.date_time, 'minutes') > 0
  if (appointmentIsPast) {
    return next(
      new ErrorResponse(`Can not be deleted. The appointment time has past.`, 404)
    );
  }

  appointments = appointments.filter(appt => appt.id !== req.params.id)

  res.status(200).json({
    success: true,
    data: {}
  });
});
