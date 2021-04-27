const express = require('express');
const app = express();
const redis = require('redis');

const {createWorkbook} = require('./excel');

const port = 9000;
const client = redis.createClient(6379, '127.0.0.1', {'return_buffers': true});

client.on("error", function(error) {
  console.error(error);
});

app.get('/', (req, res) => {
  res.send('Vamoo');
});

app.get('/putvalur', (req, res) => {
  client.set("key", "vamoooo do Redis");
  res.send('gravado no redis');
});

app.get('/getvalue', (req, res) => {
  client.get("key", function(err, reply) {
    res.send(reply);
  });
});

app.get('/excel', async (req, res) => {
  const fileName = 'FileName.xlsx';
  const workbook = createWorkbook();

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader("Content-Disposition", "attachment; filename=" + fileName);

  workbook.xlsx.write(res).then(function() { res.end() });
  
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`)
});