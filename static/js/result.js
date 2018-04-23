


function pre_query(){
  var vars = [], hash;
  var hashes = $("form").serialize().split('&');
  console.log(hashes);

  sessionStorage.setItem("hashes", JSON.stringify(hashes));
}

function form_to_query(){


  var vars = [], hash;
  var hashes = JSON.parse(sessionStorage.getItem('hashes'))
  console.log(hashes);
  for(var i = 0; i < hashes.length; i++)
  {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
  }
  console.log(vars);

  
  query(vars);
}

function query(vars){

      $.get("https://maps.googleapis.com/maps/api/geocode/json?address="+vars["location"]+"&key=AIzaSyAO_ZRxv43ImJen5xpmw1FDJrwdBTNDsJ4", function(data, status){
      console.log(data.results[0].geometry.location);
      var location = data.results[0].geometry.location
      var time = vars["time"];
      var lat_min = location["lat"] - time;
      var lat_max = location["lat"] + time;
      var lng_min = location["lng"] - time;
      var lng_max = location["lng"] + time;

      console.log("lat: ["+lat_min+","+lat_max+"]\nlng: ["+lng_min+","+lng_max+"]")

      var query_str = "geometry.location.lat:["+lat_min+" TO "+lat_max+"] AND geometry.location.lng:["+lng_min+" TO "+lng_max+"]";
      $.ajax({
      'url': 'http://localhost:8983/solr/onPointCore/select',
      'data': {'wt':'json', 'q':query_str, 'fl':'*'},
      'success': function(data) { console.log(data); setMap(data); setList(data); },
      'dataType': 'jsonp',
      'jsonp': 'json.wrf'
    });
      //alert("pause");
      
      return data.results[0].geometry.location;
  });
}

// -----------------------------------------------------------------------------
var geocoder; 
var markers = [];
var infowindow;
var locations = [];
var map;

function setMap(data){
  console.log(data.response.docs[0].name);
  geocoder = new google.maps.Geocoder;

  var unitData=[];
  for( i=0; i<10; i++){
    unitData[i] = {
      info: '<strong>'+data.response.docs[i].name+'</strong><br> '
            +data.response.docs[i]["adr_address"]+'<br>\
            <a href='+data.response.docs[i]["url"]+'>Get Directions</a>',
      lat: data.response.docs[i]["geometry.location.lat"],
      lon: data.response.docs[i]["geometry.location.lng"]
    };
  }

  
  for( i=0; i<10; i++){
    locations[i] = [unitData[i].info, unitData[i].lat, unitData[i].lon, i]
  }


  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new google.maps.LatLng(unitData[0].lat, unitData[0].lon),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  infowindow = new google.maps.InfoWindow({});

  var marker, i;

  for (i = 0; i < locations.length; i++) {
    markers[i] = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map
    });

    google.maps.event.addListener(markers[i], 'click', (function (marker, i) {
      return function () {
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, markers[i]);
      }
    })(markers[i], i));
  }
}

function openDetails(itemNum){
  infowindow.setContent(locations[itemNum][0]);
  infowindow.open(map, markers[itemNum]);
}


function setList(data){
  var id;
  var ratID;


  for(i=0; i<10; i++){
    id = "loc" + String(i);
    ratID = "rat" + String(i);
    document.getElementById(id).innerHTML = data.response.docs[i].name;
    document.getElementById(ratID).innerHTML = "Rating: " +data.response.docs[i].rating +" stars";
  }

  
}


function initMap() {
  form_to_query(); 
}







