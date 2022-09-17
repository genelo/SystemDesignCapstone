const model = require('../models/questions');

const parsePage = (page) => {
  if(typeof page === 'string'){
    page = parseInt(page, 10);
  }
  if(page === undefined || page < 1) {
    page = 1;
  }
  return page;
}

const parseCount = (count) => {
  if(typeof count === 'string'){
    count = parseInt(count, 10);
  }
  if(count === undefined || count < 1) {
    count = 5;
  }
  return count;
}

exports.getAllQuestionsByProductId = async (req, res) => {
  req.query.page = parsePage(req.query.page);
  req.query.count = parseCount(req.query.count);

  try{
    let results = await model.getAllQuestionsByProductId(req.query.product_id, req.query.page, req.query.count);
    res.status(200);
    res.end(JSON.stringify(results));
  } catch(err) {
    res.status(500);
    res.end('');
    console.log(err);
  }

}

exports.getAnswersForQuestion = async (req, res) => {
  req.query.page = parsePage(req.query.page);
  req.query.count = parseCount(req.query.count);

  try{
    let results = await model.getAnswersForQuestion(req.params.question_id, req.query.page, req.query.count);

    res.status(200);
    res.end(JSON.stringify(results));
  } catch (err){
    res.status(500).send(err);
    console.log(err);
  }
}

exports.postQuestion = async (req, res) => {
  try {
    await model.postQuestion(req.body.body, req.body.name, req.body.email, req.body.product_id);
    res.status(201);
    res.end();
  } catch(err) {
    res.status(500).send(err);
    console.log(err);

  }
}

exports.postAnswer = async (req, res) => {
  try {
    await model.postAnswer(req.params.question_id, req.body.body, req.body.name, req.body.email, req.body.photos);
    res.status(201);
    res.end();
  } catch (err){
    res.status(500).send(err);
    console.log(err);
  }
}

exports.voteHelpfulQuestion = async (req, res) => {
  try {
    await model.voteHelpfulQuestion(req.params.question_id);
    res.status(204);
    res.end();
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
}

exports.reportQuestion = async (req, res) => {
  try {
    await model.reportQuestion(req.params.question_id);
    res.status(204);
    res.end();
  } catch(err){
    res.status(500).send(err);
    console.log(err);
  }
}