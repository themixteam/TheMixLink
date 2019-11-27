var express = require('express');
var app = express();

const MongoClient = require("mongodb").MongoClient;

app.set("view engine", "ejs");

var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/images/temmie.ico'));

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});

const config = JSON.parse(require('fs').readFileSync('./config.json'));

app.get('/', function (req, res) {
    res.render("main", {
        link: null
    });
});

app.get('/api', function (req, res) {
    res.set('access-control-allow-origin', '*');
    var url = req.query.url;
    if (url != null)
    {
        if (checkProtocol(url))
        {
            short(url, req.headers.host).then(link => {
                res.json({"link":link});
            });
        }
        else
        {
            res.json({"error":"no protocol"});
        }
    }
    else
    {
        res.json({"error":"url not specified"});
    }
});

app.get('/api/docs', function (req, res) {
    res.render('api', {
        link: 'http://' + req.headers.host
    });
});

app.get('/about', function (req, res) {
    res.render('about', {});
});

app.get('/:code', function (req, res) {
    var code = req.params.code;
    const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
    mongoClient.connect(function(err, client){
        const db = client.db(config.database);
        const collection = db.collection("links");
        collection.find({code: code}).toArray(function(err, results){
            client.close();
            if (results[0] != null)
            {
                res.redirect(results[0].url);
            }
            else
            {
                res.json({"error": "incorrect code"});
            }
        });
    });
});

app.listen(config.port, function () {
  console.log(`Приложение слушает с порта ${config.port}. прИВ!`);
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 function short(url, host)
 {
    return new Promise(function(resolve, reject) {
        var code = makeid(5);
        var link = ('http://' + host + '/' + code);
        const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
        mongoClient.connect(function(err, client){
            const db = client.db(config.database);
            const collection = db.collection("links");
            let linkobj = ({
                "code": code,
                "url": url
            });
            collection.insertOne(linkobj, function(err, result){
                if(err){ 
                    return console.log(err);
                }
                client.close();
                resolve(link);
            });
        });
    });
 }

 function checkProtocol(link)
 {
    if (link.startsWith('http://'))
    {
        return true;
    }
    else
    {
        if (link.startsWith('https://'))
        {
            return true;
        }
        else
        {
            if (link.startsWith('ftp://'))
            {
                return true;
            }
            else
            {
                if (link.startsWith('ftps://'))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }
 }
