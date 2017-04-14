var express = require('express');
//below new added
var cool = require('cool-ascii-faces');
//up new added
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');

});

//below new added
app.get('/cool', function (request, response) {
  response.send(cool());
});
//up new added

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


