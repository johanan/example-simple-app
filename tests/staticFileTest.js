var assert = require('assert'),
    http = require('http'),
    SimpleApp = require('../index'),
    Response = require('./Response'),
    request = require('supertest');

describe('Static File Test', function () {
    it('should call next when no match is found', function (done) {
        var app = new SimpleApp(),
            res = new Response();
        
        var mw = {
            execCount: 0,
            handler: function (req, res, next) {
                this.execCount = this.execCount + 1;
                next();
            },
        };

        app.use(undefined, SimpleApp.staticFiles(__dirname));
        //add a handler after static files
        app.use(undefined, mw.handler.bind(mw));
        assert.strictEqual(mw.execCount, 0);
        app.use(undefined, function (req, res, next) {
            assert.strictEqual(mw.execCount, 1);
            done();
        });
        app.handle({ url: '/nomatch' }, res);
    });

    it('should serve static files', function (done) {
        var app = new SimpleApp();
        app.use(undefined, SimpleApp.staticFiles(__dirname));
        var server = http.createServer(app.handle);
        request(server)
        .get('/test.html')
        .expect('Content-Length', '7')
        .expect(200, done);
    });
});