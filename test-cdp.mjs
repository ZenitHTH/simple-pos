import http from 'http';

const url = 'http://127.0.0.1:9223/json';
console.log(`Fetching ${url}...`);

http.get(url, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`Data: ${data}`);
  });
}).on('error', (err) => {
  console.error(`Error: ${err.message}`);
});
