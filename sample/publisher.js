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
            name: "tasks",
            handler: (mqHelper) => {
                return (msg) => {
                    
                    msg.content = msg.content.toString('utf8');
                    let execute = (msg) => {
                        console.log(msg.content);
                    }
                    execute(msg);
                    mqHelper.channel.ack(msg);
                }
            }
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