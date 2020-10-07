const fs = require('fs');
const dbFun = require('../dbFunctions');

function getShop(req, res, filename, hats) {
    fs.readFile(filename, function (error, data) {
        if (error) {
            console.log(error);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 not found');
        }
        //console.log(data.toString());
        let hatBlock = dbFun.showHats(hats);
        let modified = data.toString().replace("<p>Hi there</p>", hatBlock);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(modified);
        return res.end();
    })
}

module.exports = getShop;