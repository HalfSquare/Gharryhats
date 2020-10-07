const getFile = require("./getFile");

function errorPage(req, res, message) {
    console.error(message);
    return getFile(req, res, './404.html');
    // res.writeHead(404, { 'Content-Type': 'text/html' });
    // console.log(message);
    // res.write(message.message);
    // return res.end('404 not found');
}

module.exports = errorPage;