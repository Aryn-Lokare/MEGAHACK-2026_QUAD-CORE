import http from 'http';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/admin/users/pending',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer DUMMY_TOKEN'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS_CODE: ${res.status}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
