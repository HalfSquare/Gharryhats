const url=require('url');
const fs=require('fs');
const dbOp=require('./dbOperations');
const dbFun=require('./dbFunctions');
const http=require('http');
dbOp.connect();

const server = http.createServer(function(req, res){
    let path = url.parse(req.url, true);
    switch(path.pathname){
        case '/shop':
        case '/shop.html':
            dbOp.getAll()
                //.then(hats => console.log(hats))
                .then(hats => getShop(req, res, './shop.html', hats))
                .catch(err => errorPage(req, res, err));
            break;
        case '/img':
            getImg(req, res, './img/' + path.query['image']);
            break;
        case '/':
        case '/index':
        case '/index.html':
            getFile(req, res, './index.html');
            break;
        default:
            getFile(req, res, './404.html');
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
        console.log(data.toString());
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    })   
}

function getShop(req, res, filename, hats){
    fs.readFile(filename, function(error, data){
        if (error){
            console.log(error);
            res.writeHead(404,{'Content-Type': 'text/html'});
            return res.end('404 not found');
        }
        console.log(data.toString());
        let modified = data.toString().replace("<p>Hi there</p>", "<p>" + JSON.stringify(hats) + "</p>");
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(modified);
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

function errorPage(req, res, message) {
    res.writeHead(404,{'Content-Type': 'text/html'});
    res.write(message);
    return res.end('404 not found');
}