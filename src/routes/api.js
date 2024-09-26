const express = require('express');
const { getQuestionForUser } = require('../services/questionService');

const router = express.Router();

router.get('/question', async (req, res) => {
  try {
    const { userId, region } = req.query;
    const question = await getQuestionForUser(userId, region);
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;