var HTTPS = require('https');
var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\!mission$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage('I will stop repeating myself');
    this.res.end();
  }
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\!burrito$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage('I am a delicious burrito');
    this.res.end();
  
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(arr) {
  var botResponse, options, body, botReq;
  
  botResponse = arr;
  
  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse,
    "attachments" : [
    {
      "type"  : "location",
      "lng"   : "40.000",
      "lat"   : "70.000",
      "name"  : "GroupMe HQ"
    }
      ]
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
