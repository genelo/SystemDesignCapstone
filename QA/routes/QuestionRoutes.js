const router = require('express').Router();
var controller = require('../server/controllers/questions');

router.get('', controller.getAllQuestionsByProductId)

router.get('/:question_id/answers', controller.getAnswersForQuestion);

router.post('', controller.postQuestion)

router.post('/:question_id/answers', controller.postAnswer);

router.put('/:question_id/helpful', controller.voteHelpfulQuestion);

router.put('/:question_id/report', controller.reportQuestion);

module.exports = router;
