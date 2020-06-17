const express = require('express');
const app = express();

const MongoClient = require("mongodb").MongoClient;

app.set("view engine", "ejs");

const favicon = require('serve-favicon');
app.use(favicon(__dirname + '/images/temmie.ico'));

const config = JSON.parse(require('fs').readFileSync('./config.json'));

app.get('/', function (req, res) {
    res.render("main", {
        link: null
    });
});

app.get('/api', function (req, res) {
    res.set('access-control-allow-origin', '*');
    const url = req.query.url;
    if (url != null)
    {
        if (checkProtocol(url))
        {
            short(url, req.headers.host).then(link => {
                res.json({link});
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
        link: `http://${req.headers.host}`
    });
});

app.get('/about', function (req, res) {
    res.render('about', {});
});

app.get('/:code', function (req, res) {
    const code = req.params.code;
    const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
    mongoClient.connect(function(err, client){
        const db = client.db(config.database);
        const collection = db.collection("links");
        collection.find({code}).toArray(function(err, results){
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

function makeCode(length) {
    let result = '';
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++)
    {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function short(url, host)
{
    return new Promise(function(resolve, reject) {
        const code = makeCode(5);
        const link = `https://${host}/${code}`;
        const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
        mongoClient.connect(function(error, client) {
            const db = client.db(config.database);
            const collection = db.collection("links");
            let linkObject = ({
                "code": code,
                "url": url
            });
            collection.insertOne(linkObject, function(error, result) {
                if (error)
                { 
                    return console.log(error);
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
