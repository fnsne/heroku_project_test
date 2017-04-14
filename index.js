var express = require('express');
//below new added
var cool = require('cool-ascii-faces');
var http_request = require('request');
var nearest_staion_json = {
  "code": 0,
  "result": []
};
//up new added
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');

});

//below new added
app.get('/cool', function (request, response) {
  response.send(cool());
});

function key_generator(i){
  var count = i;
  var key = "";
  key += (Math.floor(count / 1000)) ? Math.floor(count / 1000) : 0;
  count %= 1000;
  key += (Math.floor(count / 100)) ? Math.floor(count / 100) : 0;
  count %= 100;
  key += (Math.floor(count / 10)) ? Math.floor(count / 10) : 0;
  count %= 10;
  key += count;
  return key;
}

app.get('/v1/ubike-station/taipei', function (request, response) {
  http_request({ url: 'http://data.taipei/youbike', gzip: true }, function (err, res, body) {
    if ((request.query.lat) && (request.query.lng)) {
      if (err != null) {
        console.log("error: ", err);
        nearest_staion_json.code = -3;
        nearest_staion_json.result = [];
      } else if (true) {
        //I don't know how to determine wheather the location is in or not in taipei
        //check if in the taipei city range
        var ubike_data = JSON.parse(body);
        //find nearest stations
        var data_length = Object.keys(ubike_data.retVal).length;
        var stations = ubike_data.retVal;
        var station1_key = "";
        var dist_with_sta1 = 100;
        var station2_key = "";
        var dist_with_sta2 = 100;
        for (var i = 1; i < 2000; i++) {
          //for (var i = 1; i < data_length; i++) {
          var key = "";
          key = key_generator(i);
          var temp = stations[key];

          if (typeof temp === typeof undefined) {
          }
          else if ((temp.bemp > 0)) {
            //console.log(stations[key]);

            var dist_with_temp = Math.pow(Math.abs(request.query.lat - temp.lat), 2) + Math.pow(Math.abs(request.query.lng - temp.lng), 2);
            if (dist_with_temp < dist_with_sta1) {
              station2_key = station1_key;
              dist_with_sta2 = dist_with_sta1;
              station1_key = key;
              dist_with_sta1 = dist_with_temp;
            }
          }
          //console.log(stations[key]);
        }
        /*console.log(stations[station1_key]);
        console.log(stations[station2_key]);*/
        if (station1_key != "") {
          var station_str = stations[station1_key].sna;
          nearest_staion_json.result[0] = {
            "stattion": station_str
          };
        }
        if (station2_key != "") {
          station_str = stations[station2_key].sna;
          nearest_staion_json.result[1] = {
            "stattion": station_str
          };
        }
        //console.log(stations["0001"].sna);
        if ((station1_key == "") && (station2_key == "")) {
          nearest_staion_json.code = 1;
          nearest_staion_json.result = [];
        }
      }else{
        //not in the range of taipei
        nearest_staion_json.code = -2;
        nearest_staion_json.result = [];
      }
    
    } else {
      nearest_staion_json.code = -1;
      nearest_staion_json.result = [];
    }
    response.end(JSON.stringify(nearest_staion_json));
  });
});
//up new added

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});


