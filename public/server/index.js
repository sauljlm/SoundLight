const http = require('http');

const methods = {
    PUT: require('./PUT'),
    POST: require('./POST'),
    GET: require('./GET'),
    DELETE: require('./DELETE'),
}

function createRutes(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE');
    if(methods[req.method]) {
        console.log(req.method);
        methods[req.method](req, res);
    } else {
        res.end(`no se encontró ${res}`);
    }
}

http.createServer(createRutes).listen(1234);
console.log('runing on localhost:1234');
