const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/trash2cash', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const express = require('express');
const path = require('path');

const app = express();

const session = require('express-session');

// Set up session middleware
app.use(session({
  secret: 'mySuperSecretKey123!@#', // if anyone want change this please do
  resave: false,
  saveUninitialized: true
}));

// Make username and reward points available to templates
app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  res.locals.points = req.session.points || null;
  next();
});


// Serve static files (CSS, images, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Parse HTML form data
app.use(express.urlencoded({ extended: true }));


app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const loginRouter = require('./routes/login');
app.use('/', loginRouter);

const registerRouter = require('./routes/register');
app.use('/', registerRouter);

const dashboardRouter = require('./routes/dashboard');
app.use('/dashboard', dashboardRouter);

const rewardsRouter = require('./routes/rewards');
app.use('/rewards', rewardsRouter);

const logWasteRouter = require('./routes/log-waste');
app.use('/log-waste', logWasteRouter);

const adminLoginRouter = require('./routes/adminLogin');
app.use('/', adminLoginRouter);

const adminDashboardRouter = require('./routes/admindashboard');
app.use('/', adminDashboardRouter);

const adminUsersRouter = require('./routes/adminUsers');
app.use('/', adminUsersRouter);

const adminRewardsRouter = require('./routes/adminRewards');
app.use('/', adminRewardsRouter);


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
