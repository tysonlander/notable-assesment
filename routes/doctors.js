const express = require('express');
const {
  getDoctors,
  createDoctor,
  getAppointmentsByDoctor,
  createAppointment
} = require('../controllers/doctors');

// // Other resource routers
// const appointmentsRouter = require('./appointments')

const router = express.Router();

// // Re-route into other resource routers
// router.use('/:doctorId', appointmentsRouter)

router.route('/').get(getDoctors).post(createDoctor);

router.route('/:doctorId/appointments').get(getAppointmentsByDoctor).post(createAppointment);

module.exports = router;
