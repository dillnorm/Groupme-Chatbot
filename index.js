var http, director, bot, router, server, port;

http        = require('http');
director    = require('director');
bot         = require('./bot.js');

router = new director.http.Router({
  '/' : {
    post: bot.respond,
    get: ping
  }
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
    console.log("Recieved request: \'" + req.chunks[0] + "\'\n");
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

//start the first cron job for spontanious messages
bot.spontanious();

port = Number(process.env.PORT || 5000);
server.listen(port);

function ping() {
  this.res.writeHead(200);
  this.res.end("You've reached Bo, but I don't communicate on this website. Sorry!");
}
