const fs = require('fs');
const dbFun = require('../dbFunctions');

function getCart(req, res, filename, cart) {
    cart = JSON.parse(cart);
     console.log(cart);
    fs.readFile(filename, function (error, data) {
        if (error) {
            console.log(error);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 not found');
        }
        if (cart) {
            let cartHtml;
            if (cart.length > 0) {
                cartHtml = `
                <table class="table">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Item</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Delete</th>
                    </tr>
                    </thead><tbody>`
                
                    cart.forEach(item => {
                    cartHtml += `
                        <tr>
                        <th scope="row"></th>
                        <td>${JSON.stringify(item)}</td>
                        <td>1</td>
                        <td><button>Delete</button></td>
                        </tr>
                        `;
                })
                cartHtml += `</tbody></table>`
            } else {
                cartHtml = "<p>No Items in Cart</p>"
            }

            let modified = data.toString().replace("<p>Loading...</p>", cartHtml);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(modified);
            return res.end();
        } else {
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