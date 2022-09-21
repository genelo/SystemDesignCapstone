const db = require('../db');

//get all questions
//~100ms => .4 ms
exports.getAllQuestionsByProductId = async (id, page, count) => {
  let client;
  let res;
  let offset = (page - 1) * count;
  try {
    client = await db.connect();
    res = await client.query(`SELECT * FROM question WHERE product_id=${id} AND reported = false LIMIT ${count} OFFSET ${offset};`);
  } catch(err){
    console.log(err);
  } finally {
    if(client){
      client.release();
    }
  }

  return res.rows;
}

//get all answers for this question
exports.getAnswersForQuestion = async (id, page, count) => {
  let client;
  let res;
  let offset = (page - 1) * count;

  try {
    client = await db.connect();
    //~.3ms
    res = await client.query(`SELECT * FROM answer where question_id = ${id};`);
    //~225ms
    // res = await client.query(`WITH groupedPhotos as ( select answer_id, array_agg(url) as url from photo where answer_id in ( select id from answer where question_id =${id}) group by answer_id) SELECT a.*, groupedPhotos.url from answer a left join groupedPhotos on a.id = groupedPhotos.answer_id where a.id in ( select id from answer where question_id = ${id}) LIMIT ${count} OFFSET ${offset};`); //~390 ms
  } catch(err){
    console.log(err);
  }finally {
    if(client){
      client.release();
    }  }

  return res.rows;
}

//post new question
exports.postQuestion = async (body, name, email, product_id) => {
  let client;

  try {
    const query = 'INSERT INTO question (product_id, body, asker_name, asker_email) VALUES($1, $2, $3, $4);';
    const values = [product_id, body, name, email];
    client = await db.connect();
    await client.query(query, values);
  } catch(err){
    console.log(err);
  } finally {
    if(client){
      client.release();
    }  }
}

//post new answer
exports.postAnswer = async (id, body, name, email, photos = []) => {
  let client;

  try {
    const query = 'INSERT INTO answer (question_id, body, answerer_name, answerer_email, photos) VALUES ($1, $2, $3, $4, $5);'
    const values = [id, body, name, email, photos];

    // const query = 'INSERT INTO answer (question_id, body, answerer_name, answerer_email) VALUES ($1, $2, $3, $4) RETURNING id;';
    // const values = [id, body, name, email];
    client = await db.connect();
    //await client.query('BEGIN');
    await client.query(query, values);
    // const newAnswerId = await client.query(query, values);

    // for(let i = 0; i < photos.length; i++){
    //   await client.query('INSERT INTO photo (answer_id, url) VALUES ($1, $2);', [newAnswerId.rows[0].id, photos[i]])
    // }

    //await client.query('COMMIT');
  } catch(err){
    //await client.query('ROLLBACK');
    throw err;
  }finally {
    if(client){
      client.release();
    }  }

}

//vote as helpful question
exports.voteHelpfulQuestion = async (id) => {
  let client;

  try {
    client = await db.connect();
    await client.query(`UPDATE question SET helpful = helpful + 1 WHERE id = ${id};`);
  } catch(err){
    console.log(err);
  } finally {
    if(client){
      client.release();
    }  }

}

//report question
exports.reportQuestion = async (id) => {
  let client;

  try {
    client = await db.connect();
    await client.query(`UPDATE question SET reported = true WHERE id = ${id};`);
  } catch(err){
    console.log(err);
  } finally {
    if(client){
      client.release();
    }  }
}