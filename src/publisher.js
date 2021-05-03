const amqp = require('amqplib/callback_api');

module.exports = {
    publish: (msg) => {
        amqp.connect('amqp://rabbitmq', function(error0, connection) {
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
                channel.sendToQueue(queue, Buffer.from(msg));

                console.log(" [x] Sent %s", msg);
            });
            setTimeout(function() {
                connection.close();
                process.exit(0);
            }, 5000);
        });
    }
};