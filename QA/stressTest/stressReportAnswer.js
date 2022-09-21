import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:3000/qa/answers/' + Math.floor(Math.random()* 100000) + '/report';

  const res = http.put(url);
  check(res, { 'status was 204': (r) => r.status == 204 });

}