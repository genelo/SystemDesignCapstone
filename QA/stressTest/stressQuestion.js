import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};


export default function () {
  const url = 'http://localhost:3000/qa/questions?product_id=' + Math.floor(Math.random()* 100000);

  const res = http.get(url);
  check(res, { 'status was 200': (r) => r.status == 200});
}