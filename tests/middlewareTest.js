var assert = require("assert"),
    SimpleApp = require('../index'),
    Response = require('./Response');

describe('RouteMatchTest', function () {
    it('Undefined route', function (done) {
        var app = new SimpleApp();
        assert.strictEqual(app.routeMatch(undefined, '/'), true);
        assert.strictEqual(app.routeMatch('/', '/'), true);
        assert.strictEqual(app.routeMatch('/test', '/'), false);
        done();
    })
});

describe('MiddlewareTest', function () {
    var app, 
        mw;

    beforeEach(function () {
        app = new SimpleApp();
        mw = {
            execCount: 0,
            error: undefined,
            handler: function (req, res, next) {
                this.execCount = this.execCount + 1;
            },
            errorHandler: function (err, req, res, next) {
                this.execCount = this.execCount + 1;
                this.error = err;
            },
        };
    });

    it('use should add middleware', function (done){
        var res = new Response();
    
        app.use(undefined, mw.handler.bind(mw));
        assert.strictEqual(mw.execCount, 0);
        app.handle({}, res);
        assert.strictEqual(mw.execCount, 1);
        done();
    });

    it('should skip if there is an error', function (done) {
        var res = new Response();
        
        app.use(undefined, function (req, res, next) { next(new Error()); });
        app.use(undefined, mw.handler.bind(mw));
        assert.strictEqual(mw.execCount, 0);
        app.handle({}, res);
        assert.strictEqual(mw.execCount, 0);
        done();
    });

    it('should run the error middleware', function (done) {
        var res = new Response();
        app.use(undefined, function (req, res, next) { next(new Error()); });
        app.use(undefined, mw.errorHandler.bind(mw));
        assert.strictEqual(mw.execCount, 0);
        app.handle({}, res);
        assert.strictEqual(mw.execCount, 1);
        done();
    });
    
    it('should pass the error when unmatched middleware', function (done) { 
        var res = new Response();
        app.use(undefined, function (req, res, next) { next(new Error()); });
        //this one should not be executed
        app.use('/passover', mw.handler.bind(mw));
        app.use(undefined, mw.errorHandler.bind(mw));
        assert.strictEqual(mw.execCount, 0);
        app.handle({}, res);
        assert.strictEqual(mw.execCount, 1);
        assert.notStrictEqual(mw.error, undefined);
        done();
    });

});