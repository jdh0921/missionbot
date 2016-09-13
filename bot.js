var HTTPS = require('https');
var botID = process.env.BOT_ID;

function respond() {
  //Check for Mission Keyword
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\!mission$/;
  var keyword = request.text.slice(0,8)
  if(keyword && botRegex.test(keyword)) {
    this.res.writeHead(200);
    mission(request.text);
    postMessage('I need a friend. :(');
    this.res.end();
  }
  
  botRegex = /^\!burrito$/;
  
  if(keyword && botRegex.test(keyword)) {
    this.res.writeHead(200);
    postMessage('I am a delicious Burrito');
    this.res.end();
    return;
  
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
    return;
  }
}
function mission(banner) {
//Parse Google Spreadsheet for Appropriate Banner and Mission, if Applicable
  var bannerlookup = banner.slice(9);
  var mission = bannerlookup.indexOf(" ");
  var missionid = bannerlookup.slice(mission+1);
  var bannerid = bannerlookup.substr(0,mission);
  console.log(bannerlookup);
  console.log(mission);
  console.log(missionid);
  console.log(bannerid);
  
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'us-cdbr-iron-east-04.cleardb.net',
  user     : 'b643743dcc0429',
  password : '5f59d79',
  database : 'heroku_54c7a89f9f7eb2d'
});

connection.connect();

connection.query('SELECT bannerid from banner', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
    console.log('Hello!');
  else
    console.log('Error while performing Query.');
});

connection.end();
}
function handleQueryResponse(response){
  console.log(response);
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
