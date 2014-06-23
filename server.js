var express = require('express');

  // Testing an JWT implementation ----
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
  // --------------------------

cors = require('cors');
bets = require('./routes/bets');
auth = require('./routes/auth');

var secret = 'this is the secret secret secret 12356';

 
var app = express();
 
app.configure(function () {
  app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
  
  app.use('/bets', expressJwt({secret: secret}));
  
  app.use(cors());
  app.use(express.bodyParser());
 
  // Testing an JWT implementation ----  ! json() & urlencoded() should be encluded in bodyParser()... !
  app.use(express.json());
  app.use(express.urlencoded());
  app.use('/', express.static(__dirname + '/'));
  
  app.use(function(err, req, res, next){
  	if (err.constructor.name === 'UnauthorizedError') {
    	res.send(401, 'Unauthorized User');
	}
  });
  // --------------------------

});

app.get('/debug', bets.findAll);
app.get('/debug/:username', bets.findBetsForUser);

 
app.get('/bets', bets.findAll);
app.get('/bets/:username', bets.findBetsForUser);
app.post('/bets', bets.addBet);
app.put('/bets/:id', bets.updateBet);
app.delete('/bets/:id', bets.deleteBet);

app.post('/auth/new', auth.addUser);
app.post('/auth', auth.checkUser);
app.get('/auth', auth.findAll);   /* primarily for debugging purposes should be removed for production */
 
app.listen( process.env.PORT || 3000);
console.log('Listening on port 3000...');
