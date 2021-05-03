
const amqp = require('amqplib/callback_api');

module.exports = {
    consume: () => {
        amqp.connect('amqp://rebbitmq', function(error0, connection) {
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

                channel.consume(queue, function(msg) {
                    return msg.content.toString();
                }, {
                    noAck: true
                });
            });
        });
    }
};