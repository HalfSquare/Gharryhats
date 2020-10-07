const fs = require('fs');

function getImg(req, res, filename) {
    fs.readFile(filename, function (error, data) {
        if (error) {
            console.log(error);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 not found');
        }

        if (!filename.endsWith('.png')) {
            filename = filename + '.png';
        }

        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.write(data);
        return res.end();
    })
}

module.exports = getImg;