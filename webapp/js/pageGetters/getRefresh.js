const fs = require('fs');
const dbFun = require('../dbFunctions');

function getRefresh(req, res, htmlFilename, jsFilename, path) {
    fs.readFile(htmlFilename, function (error, htmlData) {
        if (error) {
            console.log(error);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('404 not found');
        }
        //console.log(data.toString());

        let jsData = fs.readFileSync(jsFilename);
        let modifiedJs = '<script>' + jsData.toString() + '</script>'
        let modifiedHtml = htmlData.toString().replace("<script id='loginScript'></script>"
            , modifiedJs);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(modifiedHtml);
        return res.end();
    })
}

module.exports = getRefresh;