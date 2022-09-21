import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};


export default function () {
  const url = 'http://localhost:3000/qa/questions/';

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    body: 'TEST',
    name: 'TEST',
    email: 'TEST',
    product_id: Math.floor(Math.random()* 100000)
  });

  const res = http.post(url, body, params);
  check(res, { 'status was 201': (r) => r.status == 201 });
}