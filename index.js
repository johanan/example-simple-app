var staticFiles = require('./static'),
    powered = require('./powered');

module.exports = SimpleApp;
module.exports.staticFiles = staticFiles;
module.exports.powered = powered;

function SimpleApp() {
    mwStack = [];
    
    this.use = function (route, func) {
        mwStack.push({route: route, func: func});
    };
    
    this.routeMatch = function routeMatch(route, url) {
        return route === undefined || route === url;
    };
        
    this.handle = function (req, res) {
        var index = 0,
            routeMatch = this.routeMatch;
        
        var next = function next(err) {
            var mw = mwStack[index]
            index++;

            if (mw === undefined) {
                return;
            }

            if (routeMatch(mw.route, req.url)) {
                if (mw.func.length === 3 && err === undefined)
                    mw.func.call(this, req, res, next);
                else if (mw.func.length === 4)
                    mw.func.call(this, err, req, res, next);
                else
                    next(err);
            } else {
                next(err);
            }
        };
        
        next();
    }.bind(this);
    
    return this;
};