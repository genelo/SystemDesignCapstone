const db = require('../db');

//mark answer as helpful
exports.voteHelpfulAnswer = async (id) => {
  const client = await db.connect();
  await client.query(`UPDATE answer SET helpful = helpful + 1 WHERE id = ${id};`);
  client.release();
}

//report answer
exports.reportAnswer = async (id) => {
  const client = await db.connect();
  await client.query(`UPDATE answer SET reported = true WHERE id = ${id};`);
  client.release();
}