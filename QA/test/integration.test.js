const db = require('../server/db');
const { assert } = require('chai');

describe('Database can connect', function() {

  it('Can connect to DB', async function(){
    const client = await db.connect();
    assert(client != undefined,'client failed to connect');
    client.release();
  });
});

describe('Answer Route API', function() {

    it('Vote answer as helpful', async function() {
      const client = await db.connect();
      client.query('BEGIN');
      const oldHelpful = await client.query('SELECT helpful FROM answer WHERE id = 1;');

      await client.query(`UPDATE answer SET helpful = helpful + 1 WHERE id = 1;`);
      const newHelpful = await client.query('SELECT helpful FROM answer WHERE id = 1;')

      assert(oldHelpful.rows[0].helpful + 1 === newHelpful.rows[0].helpful);
      client.query('ROLLBACK');
      client.release();
    });

    it('Report answer', async function(){
      const client = await db.connect();
      client.query('BEGIN');
      const oldReported = await client.query('SELECT reported FROM answer WHERE id = 1;');
      await client.query('UPDATE answer SET reported = NOT reported WHERE id = 1');
      const newReported = await client.query('SELECT reported FROM answer WHERE id =1;');

      assert(oldReported.rows[0].reported === !newReported.rows[0].reported);
      client.query('ROLLBACK');
      client.release();
    });
});

describe('Question Route API', function(){

  it('Get questions for product', async function(){
    const client = await db.connect();
    const questions = await client.query('SELECT * FROM question WHERE product_id =1;');
    assert(questions.rows.length > 0 , 'failed to get questions for product');
    client.release();
  });

  it('Get answers for question', async function(){
    const client = await db.connect();
    const answers = await client.query('SELECT * FROM answer WHERE question_id =1;');
    assert(answers.rows.length > 0, 'failed to get answers for question');
    client.release();
  });

  it('Post new question', async function() {
    const client = await db.connect();
    client.query('BEGIN');
    const oldLast = await client.query('SELECT id FROM question ORDER BY id DESC LIMIT 1;');
    const query = 'INSERT INTO question (product_id, body, asker_name, asker_email) VALUES($1, $2, $3, $4);';
    const values = [1, "test", "test", "test"];
    await client.query(query, values);

    const newLast = await client.query('SELECT id FROM question ORDER BY id DESC LIMIT 1;');

    assert(oldLast.rows[0].id < newLast.rows[0].id, 'Did not post question successfully');
    client.query('ROLLBACK');
    client.release();
  });

  it('Post new answer', async function() {
    const client = await db.connect();
    client.query('BEGIN');
    const oldAnswerLast = await client.query('SELECT id FROM answer ORDER BY id DESC LIMIT 1;');
    const oldPhotoLast = await client.query('SELECT id FROM photo ORDER BY id DESC LIMIT 1;');
    console.log('MEOW');
    const query = 'INSERT INTO answer (question_id, body, answerer_name, answerer_email) VALUES ($1, $2, $3, $4);';
    const values = [1, 'test', 'test', 'test'];
    const photos = ['test'];
    await client.query(query, values);

    for(let i = 0; i < photos.length; i++){
      await client.query('INSERT INTO photo (answer_id, url) VALUES ($1, $2);', [1, photos[i]])
    }

    const answerLast = await client.query('SELECT id FROM answer ORDER BY id DESC LIMIT 1;');
    const photoLast = await client.query('SELECT id FROM photo ORDER BY id DESC LIMIT 1;')

    assert(oldAnswerLast.rows[0].id < answerLast.rows[0].id, 'Did not add answer successfully');
    assert(oldPhotoLast.rows[0].id < photoLast.rows[0].id, 'Did not add photo to answer');
    client.query('ROLLBACK');
    client.release();
  });

  it('Vote question as helpful', async function() {
    const client = await db.connect();
    client.query('BEGIN');
    const oldHelpful = await client.query('SELECT helpful FROM question WHERE id = 1;');
    await client.query(`UPDATE question SET helpful = helpful + 1 WHERE id = 1;`);
    const newHelpful = await client.query('SELECT helpful FROM question WHERE id = 1;')

    assert(oldHelpful.rows[0].helpful < newHelpful.rows[0].helpful, 'question was not marked helpful');
    client.query('ROLLBACK');
    client.release();
  });

  it('Report question', async function(){
    const client = await db.connect();
    client.query('BEGIN');
    const oldReported = await client.query('SELECT reported FROM question WHERE id = 1;');
    await client.query('UPDATE question SET reported = NOT reported WHERE id = 1');
    const newReported = await client.query('SELECT reported FROM question WHERE id =1;');

    assert(oldReported.rows[0].reported === !newReported.rows[0].reported, 'question was not reported');
    client.query('ROLLBACK');
    client.release();
  });
});


