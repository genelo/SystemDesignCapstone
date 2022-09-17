
const model = require('../models/answers');

exports.voteHelpfulAnswer = async (req, res) => {
  try {
    await model.voteHelpfulAnswer(req.params.answer_id);
    res.status(204);
    res.end();
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}

exports.reportAnswer = async (req, res) => {
  try {
    await model.reportAnswer(req.params.answer_id);
    res.status(204);
    res.end();
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}