require('dotenv').config();
const express = require('express');
const db = require('./server/db');

const app = express();

//routers
var questionRouter = require('./routes/QuestionRoutes');
var answerRouter = require('./routes/AnswerRoutes');

app.use(express.json());

app.use('/qa/questions', questionRouter);
app.use('/qa/answers', answerRouter);

app.set('port', 3000);

app.listen(app.get('port'));
console.log('Listening on', app.get('port'));
