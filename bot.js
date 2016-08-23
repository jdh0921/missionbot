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
    //postMessage('I need a friend. :(');
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
var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

  var blockspring = require('blockspring.js');
  var bannerlookup = banner.slice(9);
  var mission = bannerlookup.indexOf(" ");
  var missionid = bannerlookup.slice(mission+1);
  var bannerid = bannerlookup.substr(0,mission);
  
  blockspring.runParsed("personal-assistant-jeannie", {
  message: "What's the weather like in Antarctica today?"
  }, 
  function(res) 
  { 
  console.log(res.params["answer"]); 
    
  })
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
