
var debug = require('debug')('bc:utils:mqHandler');
import wrap from 'express-async-wrap';
import services from '../services/index';

module.exports = (handlerName) => {
    return wrap(async function (req, res, next) {
        debug('handlerName:', handlerName);

        // 把東西發給 queue，並等待結果回來
        let response = await services.amqp.httpRouteQueueSend(handlerName, {
            // headers: req.headers,
            User: req.User && {
                _id: req.User._id,
                token: req.User.token
            },
            params: req.params,
            query: req.query,
            body: req.body
        });

        debug('response:', response);

        // wait for queuq

        // TODO 還沒想好怎麼判斷錯誤
        if (response === 'error') {
            throw response;
        }

        let content;

        try {
            // 回來的結果要重新 parse
            content = JSON.parse(response.content.toString());
        } catch (err) {
            // FIXME 錯誤處理
            debug('mqHandler error', err);
            content = { _error: err };
        }
        // debug('content %j', content);

        if (content && content._error) {
            return next(content._error);
        }

        if (content._result && content._result._redirect) {
            return res.redirect(content._result._redirect);
        }
        if (content._result && content._result._html) {
            return res.send(content._result.html);
        }
        res.doc(content._result);
    });
};
