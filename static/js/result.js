function getquerystring() {
  qstr = window.location.href.slice(window.location.href.indexOf('?') + 1);
  console.log('qstr: '+qstr);


}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function get_stuff(query_info){
  //httpGet('http://localhost:8983/solr/xing/select/?q=*:*');
  console.log("get_stuff called with "+query_info);
  $.ajax({
  'url': 'http://localhost:8983/solr/xing/select',
  'data': {'wt':'json', 'q':query_info},
  'success': function(data) { console.log(data); },
  'dataType': 'jsonp',
  'jsonp': 'json.wrf'
});
}



function get_google(query_info){
  //httpGet('http://localhost:8983/solr/xing/select/?q=*:*');
  console.log("get_google called with "+query_info);
  $.ajax({
  'url': 'https://maps.googleapis.com/maps/api/geocode/json?address='+query_info+'&key=AIzaSyAO_ZRxv43ImJen5xpmw1FDJrwdBTNDsJ4',
  'data': {'wt':'json', 'q':query_info},
  'success': function(data) { console.log(data); },
  'dataType': 'jsonp',
  'jsonp': 'json.wrf'
});
}

function get_lat_lon(){
  var loc = [];
  var form_data = getUrlVars();

}


// -----------------------------------------------------------------------------





var map;
function initMap() {
  //Setup for showing multiple locations
  var broadway = {
		info: '<strong>Chipotle on Broadway</strong><br>\
					5224 N Broadway St<br> Chicago, IL 60640<br>\
					<a href="https://goo.gl/maps/jKNEDz4SyyH2">Get Directions</a>',
		lat: 41.976816,
		long: -87.659916
	};

	var belmont = {
		info: '<strong>Chipotle on Belmont</strong><br>\
					1025 W Belmont Ave<br> Chicago, IL 60657<br>\
					<a href="https://goo.gl/maps/PHfsWTvgKa92">Get Directions</a>',
		lat: 41.939670,
		long: -87.655167
	};

	var sheridan = {
		info: '<strong>Chipotle on Sheridan</strong><br>\r\
					6600 N Sheridan Rd<br> Chicago, IL 60626<br>\
					<a href="https://goo.gl/maps/QGUrqZPsYp92">Get Directions</a>',
		lat: 42.002707,
		long: -87.661236
	};

	var locations = [
      [broadway.info, broadway.lat, broadway.long, 0],
      [belmont.info, belmont.lat, belmont.long, 1],
      [sheridan.info, sheridan.lat, sheridan.long, 2],
    ];

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: new google.maps.LatLng(41.976816, -87.659916),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow({});

	var marker, i;

	for (i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			map: map
		});

		google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
				infowindow.setContent(locations[i][0]);
				infowindow.open(map, marker);
			}
		})(marker, i));
	}
}
