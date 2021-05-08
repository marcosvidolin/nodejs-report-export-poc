
const amqp = require('amqplib/callback_api');
const redis = require('redis');
const uuid = require('uuid');

const {createWorkbook} = require('./excel');

const client = redis.createClient(6379, 'localhost', {'return_buffers': true});

client.on("error", function(error) {
  console.error(error);
});

module.exports = {
    consume: () => {
        amqp.connect('amqp://localhost', function(error0, connection) {
            if (error0) {
                throw error0;
            }

            connection.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }

                var queue = 'export-xpto';

                channel.assertQueue(queue, {
                    durable: false
                });

                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

                channel.consume(queue, async function(msg) {
                    setTimeout(async function() {
                        console.log("inicio do processamento (settimeout)");
                        const message = JSON.parse(msg.content.toString());
                        await worker(message.user);
                        console.log("fim do processamento (settimeout)");
                    }, 10000);

                }, {
                    noAck: true
                });
            });
        });
    }
};

const worker = async (key) => {
    const workbook = createWorkbook();
    const buffer = await workbook.xlsx.writeBuffer();
    
    // obtem as notificacoes do user e add mais uma
    // deve colocar data de expiracao no arquivo e no objeto que contem o ID do arquivo
    const notification_id = uuid.v4();
    client.set(key, JSON.stringify({ 
      notifications: {
        exports: [notification_id]
      }
    }));
    client.set('files-' + notification_id, buffer);
  };