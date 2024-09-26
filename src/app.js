require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');
const { rotateCycles } = require('./services/cycleService');

const app = express();

connectDB();

app.use(express.json());
app.use('/api', apiRoutes);

// Schedule cycle rotation every Monday at 7 PM SGT
cron.schedule('0 19 * * 1', rotateCycles, {
  timezone: 'Asia/Singapore',
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));