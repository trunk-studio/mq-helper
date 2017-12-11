const MQHelper = require('./../index')
const config = require('config');
const debug = require('debug');
const getChannel = require('./../amqp/_getChannel');


it.only('MQHelper send', async (done) => {
    try {
        let {
            ADAPTER,
            URL,
            PREFIX
        } = config.amqp
        let constructorParams = {
            ADAPTER,
            URL,
            PREFIX
        }

        let mqHelper = new MQHelper(constructorParams);
        await mqHelper.init();

        let params = {
            handlerName: "test",
            data:{msg: 1}, 
            corrId:"1122334", 
            id:1,
            queueName: "dev_rpc_queue"
        }

        let result = await mqHelper.queueSend(params) 
        console.log(result);
    

        done();

    } catch (e) {
        done(e);
    }
});

it('should return a channel', async (done) => {
    //
    let ch = await getChannel('CHANNEL_TESTING');
    let exchangeName = 't_rabbitmq:socket:111111111111111';
    let queueName = 't_rabbitmq:socket:111111111111111:/#-kiculJ10oX1G_LTAAH0';

    let exchange = await ch.assertExchange(exchangeName, 'fanout', {
        durable: false,
        autoDelete: true
    });
    let queue = await ch.assertQueue(queueName, {
        durable: false,
        autoDelete: true
    });

    try {
        let bind = await ch.bindQueue(queueName, exchangeName, '');
        debug('bind success', bind);
        done();

    } catch (e) {
        console.error('bindQueue error');
        console.error('bindQueue error' + e, { e, queueName, exchangeName });
        done(e);
    }
});

it.skip('should return a channel', async (done) => {
    //
    let ch = await getChannel('CHANNEL_TESTING');
    let exchangeName = 't_rabbitmq:socket:0000000000';
    let queueName = 't_rabbitmq:socket:0000000000:/#-kiculJ10oX1G_LTAAH0';

    try {
        let bind = await ch.bindQueue(queueName, exchangeName, '');
        debug('bind success', bind);
        done();
    } catch (e) {
        console.error('bindQueue error');
        console.error('bindQueue error' + e, { e, queueName, exchangeName });
        done(e);
    }
});

it('should return a channel', async (done) => {
    let ch = await getChannel('CHANNEL_TESTING');
    let exchangeName = 't_rabbitmq:socket:22222222222';
    let queueName = 'qt_rabbitmq:socket:22222222:/#-kiculJ10oX1G_LTAAH0';

    let exchange = await ch.assertExchange(exchangeName, 'fanout', {
        durable: false,
        autoDelete: true
    });
    let queue = await ch.assertQueue(queueName, {
        durable: false,
        autoDelete: true
    });

    try {
        let bind = await ch.bindQueue(queueName, exchangeName, '');
        debug('bind success', bind);
        done();
    } catch (e) {
        console.error('bindQueue error');
        console.error('bindQueue error' + e, { e, queueName, exchangeName });
        done(e);
    }
});
