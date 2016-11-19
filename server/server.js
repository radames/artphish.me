var http = require('http');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var fs = require('fs');
var port = process.argv[2] || 7823;

var uploadDir = '/uploads';

http.createServer(function(req, res) {

  console.log(req.method)

  if (req.method === 'POST') {
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function () {

      var filename = generateFilename();

      var filepath = __dirname + uploadDir + '/' + filename;

      base64ToFile(body, filepath, function(err, filepath) {
        if (err) {
          errResponse(err);
          return;
        }

        var imageurl = 'https://artphish.me/server/uploads/' + filename;
	fs.appendFile('secret.html', '<img src="'+ imageurl +'">', function (err) {});
        successResponse({image_url: imageurl});
      });
    });
  }

  var headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type',
      'Content-Type': 'application/json'
  };

  function successResponse(data) {
    res.writeHead(200, headers);
    res.write(JSON.stringify(data));
    res.end();
  }


  function errResponse(err) {
    console.log(err);
    res.writeHead(500, headers);
    res.write(JSON.stringify({error: err}));
    res.end();
  }

}).listen(port, 10);

function base64ToFile(base64, filename, callback) {
  var buff = new Buffer(base64.replace(/^data:image\/png;base64,/,''), 'base64');
  //fs.writeFileSync(filename,buff);
//  callback();
  fs.writeFile(filename, buff,
	 (err) => {
	  if (err) throw err;
	  callback();
	});

}

function generateFilename() {
  return Date.now() + '.png';
}

