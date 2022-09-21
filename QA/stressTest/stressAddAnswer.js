import http from 'k6/http';
import { check, sleep } from 'k6';

// export const options = {
//   vus: 100,
//   duration: '30s',
// };


export default function () {
  const url = 'http://localhost:3000/qa/questions/' +
  Math.floor(Math.random()* 100000) + '/answers';

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    body: 'TEST',
    name: 'TEST',
    email: 'TEST',
    photos : ['TESTURL', 'OTHERTESTURL']
  });
  const res = http.post(url, body, params);
  console.log(res.status);
  check(res, { 'status was 201': (r) => r.status == 201 });
}