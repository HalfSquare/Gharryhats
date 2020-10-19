const fs = require('fs');
const dbOp = require('../dbOperations');
const dbFun = require('../dbFunctions');

async function getCart(req, res, filename, cart) {
    cart = JSON.parse(cart);
     console.log(cart);
    fs.readFile(filename, async function (error, data) {
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
                        <th scope="col">Price</th>
                        <th scope="col">Delete</th>
                    </tr>
                    </thead><tbody>`

                    for (let item of cart){
                        console.log(item);
                        await dbOp.getItem(item)
                        .then(res => {
                            console.log(res);
                            res = res[0];
                            cartHtml += `
                            <tr>
                            <th scope="row"></th>
                            <td>${res.name} for ${res.animal}</td>
                            <td>$${res.price}</td>
                            <td><button onClick="removeFromCart('${res._id}')">Delete</button></td>
                            </tr>
                            `
                        ;})
                    }
                
                    // cart.forEach(item => {
                    // (dbOp.getItem(item)
                    //     .then(res => {
                    //         cartHtml += `
                    //         <tr>
                    //         <th scope="row"></th>
                    //         <td>${JSON.stringify(res)}</td>
                    //         <td>1</td>
                    //         <td><button>Delete</button></td>
                    //         </tr>
                    //         `
                    //     ;}));
                        // console.log(cartHtml);
                    
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