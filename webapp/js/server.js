const url=require('url');
const fs=require('fs');

const http=require('http');
const server = http.createServer(function(req, res){
    let path = url.parse(req.url, true);
    console.log(path);
    switch(path.pathname){
        case '/shop':
            getFile(req, res, './shop.html');
            break;
        case '/img':
            
            break;
        default:
            getFile(req, res, './index.html');
            break;
    }
})

server.listen(3000);

function getFile(req, res, filename){
    fs.readFile(filename, function(error, data){
        if (error){
            console.log(error);
            res.writeHead(404,{'Content-Type': 'text/html'});
            return res.end('404 not found');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    })   
}