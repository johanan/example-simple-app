var fs = require('fs');

module.exports = function staticFilesSetup(serverPath) {
    
    return function staticFiles(req, res, next) {
        var path = serverPath + req.url;
        fs.stat(path, function (err, stats) {
            if (err)
                next();
            
            if (stats !== undefined && stats.isFile()) {
                res.writeHeader(200, {
                    'Content-Type': 'text/html',
                    'Content-Length': stats.size
                });
                var readStream = fs.createReadStream(path);
                readStream.pipe(res);
            } else {
                next();
            }
        });
    };
};