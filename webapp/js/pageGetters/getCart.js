const fs = require('fs');
const dbFun = require('../dbFunctions');

function getCart(req, res, filename, cart) {
    fs.readFile(filename, function (error, data) {
        if (error) {
            console.log(error);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 not found');
        }
        if (cart != 'undefined') {
            dbFun.showCartItems(cart)
            console.log("well something happened");
        }
        else {
            let modified = data.toString().replace("<p>Loading...</p>", "It looks like you're not signed in - login now to view your cart!");
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(modified);
            return res.end();
        }
        //let hatBlock = dbFun.showHats(hats);
        //let modified = data.toString().replace("<p>Hi there</p>", hatBlock);
    })
}

module.exports = getCart;