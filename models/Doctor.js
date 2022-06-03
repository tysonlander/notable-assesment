const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please add a first name'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Please add a last name'],
            trim: true,
        }
    }
)

module.exports = mongoose.model('Doctor', DoctorSchema);