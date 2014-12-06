module.exports = function poweredBy(req, res, next) {
    res.setHeader('Powered-By', 'JOSH!');
    next();
};