const fs = require('fs');
const dbFun = require('../dbFunctions');
const dbOp = require('../dbOperations');

function getItem(req, res, filename, hat, related) {
    fs.readFile(filename, function (error, data) {
        if (error) {
            console.log(error);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 not found');
        }
        //console.log(data.toString());
        let hatBlock = dbFun.showHat(hat);
        let relatedBlock = dbFun.showRelated(related);
        let modified = data.toString().replace('<div id="emptyShopBlock"></div>', hatBlock);
        let modified1 = data.toString().replace('<div id="emptyRelatedBlock"></div>', relatedBlock);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(modified);
        res.write(modified1);
        return res.end();
    })
}

// function getRelated(related) {
//     let relatedBlock = dbFun.showRelated(related);
// }

module.exports = getItem;