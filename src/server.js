const express = require('express');
const app = express();
const redis = require('redis');

const {publish} = require('./publisher');
const {consume} = require('./consumer');

const port = 9000;
const client = redis.createClient(6379, 'localhost', {'return_buffers': true});

client.on("error", function(error) {
  console.error(error);
});


app.get('/export-xpto', (req, res) => {

  const user = 'vidolin'; // obter usuario que realizou o request

  const message = JSON.stringify({
    user,
    filter: {
      campo1: "valor1",
      campo2: "valor2"
    }
  });

  publish(message);

  res.send();
});


app.get('/notifications', (req, res) => {
  const user = "vidolin"; // obter usuario que realizou o request
  client.get(user, function(err, reply) {
    if (!reply) {
      res.json({notifications: {}});
      return;
    }
    res.json(JSON.parse(reply.toString()));
  });
});


app.get('/files/:id', (req, res) => {
  client.get(`files-${req.params.id}`, function(err, reply) {
    const filename = 'poc-exemplo-tv.xlsx';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + filename);
    res.send(Buffer.from(reply.toString('base64'), 'base64'));
  });
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`)
});

consume();