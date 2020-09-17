const url=require('url');
const fs=require('fs');
const dbOp=require('./dbOperations');
const http=require('http');
dbOp.connect();

const server = http.createServer(function(req, res){
    let path = url.parse(req.url, true);
    switch(path.pathname){
        case '/shop':
            getFile(req, res, './shop.html');
            let hats = dbOp.getAll();
            console.log('hats: ' + hats);
            //let p = document.getElementById("item").innerText = hats;
            break;
        case '/img':
            getImg(req, res, './img/' + path.query['image']);
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

function getImg(req, res, filename){
    fs.readFile(filename, function(error, data){
        if (error){
            console.log(error);
            res.writeHead(404,{'Content-Type': 'text/html'});
            return res.end('404 not found');
        }
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.write(data);
        return res.end();
    }) 
}