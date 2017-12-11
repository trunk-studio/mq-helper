module.exports = {
    ENV: 'development',
    amqp: {
        ADAPTER: 'rabbitmq',
        URL: 'amqp://guest:guest@localhost:5672',
        PREFIX: 'dev_',
        
        QUEUES: [{
            name: "dispatchNotice_request",
            description: "",
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
        }],
        

    },
    test: {
        ANDROID_DEVICE_TOKEN: '',
        IOS_DEVICE_TOKEN_APNS: '',
        IOS_DEVICE_TOKEN_GCM: ''
    }
};
