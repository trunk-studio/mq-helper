# mq-helper

## 啟動 rabbit mq
docker run -d --name amqp.test -p 5672:5672 rabbitmq

## 啟動 consumer
node sample/consumer.js

## send message
node sample/publisher.js

## License

MIT
