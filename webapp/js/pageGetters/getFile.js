const fs = require('fs');

function getFile(req, res, filename) {
    fs.readFile(filename, function (error, data) {
        if (error) {
            console.log(error);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 not found');
        }
        //console.log(data.toString());
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    })
}

module.exports = getFile;