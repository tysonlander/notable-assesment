const express = require('express');
const {
  getDoctors,
  getAppointmentsByDoctor,
  createAppointment
} = require('../controllers/doctors');

// // Other resource routers
// const appointmentsRouter = require('./appointments')

const router = express.Router();

// // Re-route into other resource routers
// router.use('/:doctorId', appointmentsRouter)

router.route('/').get(getDoctors);

router.route('/:doctorId/appointments').get(getAppointmentsByDoctor).post(createAppointment);

module.exports = router;
