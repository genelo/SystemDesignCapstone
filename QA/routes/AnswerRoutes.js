const router = require('express').Router();
var controller = require('../server/controllers/answers');

router.put('/:answer_id/helpful', controller.voteHelpfulAnswer);

router.put('/:answer_id/report', controller.reportAnswer);

module.exports = router;
