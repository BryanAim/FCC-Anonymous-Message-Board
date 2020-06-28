'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');
const helmet = require('helmet');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const CONNECTION_STRING =  process.env.DB;

var app = express();

app.use(helmet());
//Sets frameguard, prevent clickjacking
app.use(helmet.frameguard({action: 'deny'}));
//sets 'X-DNS-Prefetch-Control: off
app.use(helmet.dnsPrefetchControl());
//sets 'referrer-policy: same origin'
app.use(helmet.referrerPolicy({policy: 'same-origin'}));

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/b/:board/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/board.html');
  });
app.route('/b/:board/:threadid')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/thread.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);

MongoClient.connect(CONNECTION_STRING)
.then(client=> {
  const db = client.db('message-board');
  const collection = db.collection('board_threads');
  app.locals.db = db;
}).catch(error=>console.log(error)
);

//Sample Front-end

    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(3000, function () {
  console.log("Listening on port 3000");
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for testing
