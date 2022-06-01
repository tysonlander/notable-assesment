const express = require('express');
const { deleteAppointment } = require('../controllers/appointments');

const router = express.Router();

router.route('/:id').delete(deleteAppointment);

module.exports = router;
