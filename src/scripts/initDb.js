require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');
const Cycle = require('../models/Cycle');
const User = require('../models/User');

const connectDB = require('../config/database');

const initDb = async () => {
  await connectDB();

  await Question.deleteMany({});
  await Cycle.deleteMany({});

  await Question.insertMany([
    { content: '1. What\'s your idea of a perfect date in Singapore?', region: 'Singapore' },
    { content: '2. How do you like to spend your weekends in the city?', region: 'Singapore' },
    { content: '3. What\'s your favorite local dish and why?', region: 'Singapore' },
  ]);

  await Question.insertMany([
    { content: '1. What\'s your go-to activity for a first date?', region: 'US' },
    { content: '2. How do you like to unwind after a long week?', region: 'US' },
    { content: '3. What\'s the most adventurous thing you\'ve ever done?', region: 'US' },
  ]);

  const createUsers = async () => {
    const users = [
      { name: 'Loke', region: 'Singapore' },
      { name: 'Vedant', region: 'US' },
    ];

    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
    }
  };

  await createUsers();

  console.log('Database initialized with sample data');
  process.exit(0);
};

initDb();