const fs = require('fs');
const dbFun = require('../dbFunctions');
const dbOp = require('../dbOperations');

function getItem(req, res, filename, hat) {
    fs.readFile(filename, function (error, data) {
        if (error) {
            console.log(error);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 not found');
        }
        let relatedBlock = "";
        dbOp.getRelated(hat.animal)
            .then(related => {relatedBlock = getRelated(req, res, filename, related)})
            .catch(err => getError(req, res, err));
        //console.log(data.toString());
        let hatBlock = dbFun.showHat(hat);
        let modified = data.toString().replace("<p>Hi there</p>", hatBlock);
        let modified1 = data.toString().replace("<p> Related </p>", relatedBlock);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(modified);
        res.write(modified1);
        return res.end();
    })
}

function getRelated(related) {
    let relatedBlock = dbFun.showRelated(related);
}

module.exports = getItem;