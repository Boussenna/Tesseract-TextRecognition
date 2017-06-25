/**
 * Created by Nesrine on 20/06/2017.
 */

const hostname = '127.0.0.1';
const port = 3000;
var tesseract = require('node-tesseract');
var Express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var app = Express();
app.use(bodyParser.json());
const http = require('http').Server(app);


var options = {
    // Use the english and arabic languages
    l: 'fra+ara',
    // Use the segmentation mode #6 that assumes a single uniform block of text. decrease if it's columns
    psm: 3,
    // Increase the allowed amount of data in stdout to 16MB (A little exaggerated)
    env: {
        maxBuffer: 4096 * 4096
    }
};


app.get('/', function (req,res) {
    res.sendFile(__dirname+'/index.html');
});

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './Images/');

    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer ({
    storage: Storage
});

app.post('/upload',upload.single('file'), function (req,res) {
    tesseract.process(req.file.destination+req.file.filename ,options, (err, text) => {
        if(err){
            return console.log("An error occured: ", err);
        }
        console.log("Recognized text:");
        console.log(text);});
    //res.send(text);});
});

http.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});