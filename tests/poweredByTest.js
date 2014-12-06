var assert = require("assert"),
    SimpleApp = require('../index'),
    Response = require('./Response');

describe('Powered by test', function () {
    it('should add a powered-by header', function (done) {
        var app = new SimpleApp(),
            res = new Response();

        app.use(undefined, SimpleApp.powered);
        assert.strictEqual(res.headers.length, 0);
        app.handle({}, res);
        assert.strictEqual(res.headers.length, 1);
        assert.strictEqual(res.headers[0][0], 'Powered-By');
        assert.strictEqual(res.headers[0][1], 'JOSH!');
        done();
    });
});