module.exports = function Response() {
    var that = this;
    this.headers = [];
    this.statusCode = 0;
    this.setHeader = function (header, value) {
        this.headers.push([header, value]);
    };
    this.writeHeader = function (statusCode, headerObject) {
        that.statusCode = statusCode;
    };
    
    return this;
};
