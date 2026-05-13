const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/property');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const { forgotPassword } = require('./controllers/authController'); // Import the forgotPassword controller
const resetPasswordRoutes = require('./routes/resetPasswordRoutes'); 
const contactRoutes = require('./routes/contact');
const pdfRoutes = require('./routes/pdfRoutes'); // Import the new PDF route
const contactOwnerRoutes = require('./routes/contactOwnerRoutes'); 
const bookingRoutes = require('./routes/booking');
require('dotenv').config();  // Ensure .env variables are loaded


const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// mongoose.connect('mongodb://localhost:27017/homevision', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect('mongodb://127.0.0.1:27017/homevision')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Error:', err));


// Serve the main page
app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

// Serve the admin page (accessible directly at /admin)
app.get('/admin', (req, res) => {
  res.send('Welcome to the admin page!');
});

app.use('/api', authRoutes);
app.use('/api', propertyRoutes);
app.use('/api', userRoutes);
app.use('/api', resetPasswordRoutes);
app.use('/api', contactRoutes);
app.use('/api', pdfRoutes); // Add the PDF route
app.use('/api', contactOwnerRoutes);
app.use('/booking', bookingRoutes);


// Forgot Password route
app.post('/api/forgot-password', forgotPassword); // Add the forgot password route


// Dashboard route
app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});



app.listen(5000, () => {
  console.log('Server running on port 5000');
});
