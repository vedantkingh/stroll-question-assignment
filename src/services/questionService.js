const Question = require('../models/Question');
const cache = require('../utils/cache');

const getQuestionForUser = async (userId, region) => {
  const cacheKey = `questions:${region}`;
  let questions = await cache.get(cacheKey);

  if (!questions) {
    questions = await Question.find({ region });

    if (questions.length === 0) {
      throw new Error('No questions found for the specified region');
    }

    await cache.set(cacheKey, JSON.stringify(questions), 'EX', 3600); // Caching the questions for 1 hour
  } else {
    questions = JSON.parse(questions);
  }

  if (questions.length === 0) {
    throw new Error('No questions found for the specified region');
  }

  // Randomly select one question and send to the user, I assumed that the user will answer only one question at a time.
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

module.exports = {
  getQuestionForUser,
};