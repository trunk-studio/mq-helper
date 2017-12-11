const MQHelper = require('./../index')
const config = require('config');
const debug = require('debug');



const run = async () => {
    try {
        
        let {
            ADAPTER,
            URL,
            PREFIX,
            QUEUES,
        } = config.amqp
        let constructorParams = {
            ADAPTER,
            URL,
            PREFIX
        }
        let mqHelper = new MQHelper(constructorParams);
        await mqHelper.init();
        QUEUES.forEach(queue => {
            let result = mqHelper.queueConsume(queue);
        });

    
    
        
            
    } catch (e) {
        console.error(e);
        throw e;
    }
}
run();
// var q = 'tasks_request';

// var open = require('amqplib').connect('amqp://localhost');


// // Consumer
// open.then(function(conn) {
//   return conn.createChannel();
// }).then(function(ch) {
//   return ch.assertQueue(q).then(function(ok) {
//     return ch.consume(q, function(msg) {
//       if (msg !== null) {
//         console.log(msg.content.toString());
//         ch.ack(msg);
//       }
//     });
//   });
// }).catch(console.warn);