const Question = require('../models/Question');
const cache = require('../utils/cache');

// I have optimised the code to rotate the cycles for all regions in parallel. 
// Instead of using a for loop, I have used a map to store the questions for each region and then rotated the regions for each question.
const rotateCycles = async () => {
  const regions = await Question.distinct('region');
  const questions = await Question.find().sort('_id');

  const regionQuestionsMap = new Map();
  regions.forEach(region => {
    regionQuestionsMap.set(region, []);
  });

  questions.forEach(question => {
    if (regionQuestionsMap.has(question.region)) {
      regionQuestionsMap.get(question.region).push(question);
    }
  });

  // Rotate regions for each question
  for (const [region, regionQuestions] of regionQuestionsMap.entries()) {
    for (const question of regionQuestions) {
      const currentRegionIndex = regions.indexOf(question.region);
      const nextRegionIndex = (currentRegionIndex + 1) % regions.length;
      question.region = regions[nextRegionIndex];
    }
  }

  // Save all updated questions in parallel
  await Promise.all(questions.map(question => question.save()));

  // Clear cache for all regions in parallel
  await Promise.all(regions.map(region => cache.del(`question:${region}`)));
};

module.exports = {
  rotateCycles,
};