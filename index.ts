
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Route
const doctorsRouter = require('./routes/doctors')
const appointmentsRouter = require('./routes/appointments')


const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// // Mount routers
app.use('/api/v1/doctors', doctorsRouter);
app.use('/api/v1/appointments', appointmentsRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
PORT,
console.log(
	// @ts-ignore
	`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	// @ts-ignore
	console.log(`Error unhandledRejection: ${err.message}`.red);
// Close server & exit process
// server.close(() => process.exit(1));
});

// Handle uncaught exception
process.on('uncaughtException', (err) => {
	// @ts-ignore
	console.log(`Error uncaughtException: ${err.message}`.red);
})
