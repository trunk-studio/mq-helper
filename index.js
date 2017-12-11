const debug = require('debug')('MQ');
var amqp = require('amqplib');


class MQHelper {
    constructor(config) {
        let {
            ADAPTER,
            URL,
            PREFIX
        } = config;
        this.ADAPTER = ADAPTER;
        this.URL = URL;
        this.PREFIX = PREFIX;
        this.rpcQueueName = PREFIX + 'rpc_queue';


    }
    async getConnection() {
        let connection = amqp.connect(this.url);
        return await new Promise((resolve, reject) => {
            connection
                .then(conn => resolve(conn))
                .catch(err => reject(err));
        });
    }

    async getChannel() {
        let channel = await this.connection.createChannel();
        channel.prefetch(100);
        channel.on('error', function (err) {
            debug('Channel ' + name + ' On Error: ', err);
        });

        return channel;
    };

    async init() {
        let connection = await this.getConnection();
        this.connection = connection;

        let channel = await connection.createChannel();
        this.channel = channel;
        
    };




    async queueSend(param) {
        let {handlerName, data, name} = param;
        if(name == null) name = "default";

        let sendName = name;

        try {    
            // 建立一個自己的 queue
            console.log("name", sendName);
            let q = await this.channel.assertQueue(sendName);
    
            let content = {
                data: data
            };
    
            // 送出 rpc 請求

            return await this.channel.sendToQueue(
                sendName,
                new Buffer(JSON.stringify(content)),
                { replyTo: q.queue }
            );
    
        } catch (err) {
            console.error(err);
        }
    };
    async queueConsume(params) {

        try {    
            let {name, handler} = params;
            if(name == null) name = "default";
            let consumeName = name ;
    
            let q = await this.channel.assertQueue(consumeName);    
            this.channel.consume(q.queue, handler(this));

        } catch (err) {
            console.error(err);
        }
    };  

    async hello(props) {
        return await new Promise(resolve => {
            resolve('hello world')
        })
    }

}
module.exports = MQHelper;