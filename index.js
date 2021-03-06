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



    }
    async getConnection() {

        let connection = amqp.connect(this.URL);
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

        let { handlerName, data, name } = param;
        if (name == null) name = "default";

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
            let { name, handler } = params;
            if (name == null) name = "default";
            let consumeName = name;
            console.log("consumeName", consumeName)
            let q = await this.channel.assertQueue(consumeName, { durable: true });
            this.channel.prefetch(1)
            this.channel.consume(q.queue, handler(this), { noAck: false });
            // 參考 https://zhuanlan.zhihu.com/p/28276010
            // 透過 下面控制依序執行
            // execute(params).then(() => {
            //     mqHelper.channel.ack(msg);
            // });
            
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