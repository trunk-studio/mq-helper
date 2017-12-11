const MQHelper = require('./../index')
const config = require('config');
const debug = require('debug');


const run = async () => {
    try {
        let {
            ADAPTER,
            URL,
            PREFIX,
            QUEUES
        } = config.amqp
        let constructorParams = {
            ADAPTER,
            URL,
            PREFIX
        }
        let mqHelper = new MQHelper(constructorParams);
        await mqHelper.init();
        let params = {            
            data:{msg: 1}, 
            corrId:"1122334", 
            id:1,
            ...QUEUES[0]
        }

    
        let result = await mqHelper.queueSend(params); 
        setTimeout(process.exit, 500);
            
        

    } catch (e) {
        console.error(e);
        throw e;
    }
}
run();

// var q = 'tasks';

// var open = require('amqplib').connect('amqp://localhost');

// // Publisher
// open.then(function(conn) {
//   return conn.createChannel();
// }).then(function(ch) {
//   return ch.assertQueue(q).then(function(ok) {
//     return ch.sendToQueue(q, new Buffer('something to do'));
//   });
// }).catch(console.warn);