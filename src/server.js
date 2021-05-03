const express = require('express');
const app = express();
const uuid = require('uuid');
const redis = require('redis');

const {createWorkbook} = require('./excel');
// const {consume} = require('./consumer');

const port = 9000;
const client = redis.createClient(6379, 'redis', {'return_buffers': true});

client.on("error", function(error) {
  console.error(error);
});



app.get('/export-xpto', async (req, res) => {

  const user = 'vidolin'; // obter usuario que realizou o request

  const workbook = createWorkbook();
  const buffer = await workbook.xlsx.writeBuffer();
  
  // obtem as notificacoes do user e add mais uma
  const notification_id = uuid.v4();
  client.set(user, JSON.stringify({ 
    notifications: {
      exports: [notification_id]
    }
  }));
  client.set('files-' + notification_id, buffer);

  res.send();
});


app.get('/notifications', (req, res) => {
  const user = "vidolin"; // obter usuario que realizou o request
  client.get(user, function(err, reply) {
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