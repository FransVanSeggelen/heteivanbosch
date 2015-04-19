var geoObject;
var comObject;
var myHeading = 0;

function loadScript() {
	//document.addEventListener('deviceready', onDeviceReady);
	onDeviceReady();
};

function onDeviceReady(){
	document.getElementById('btnEi').addEventListener('mouseup', pagina1Show, false);
	document.getElementById('btnShine').addEventListener('mouseup', pagina2Show, false);
	document.getElementById('btnMic').addEventListener('mouseup', pagina3Show, false);
	document.getElementById('btnKompas').addEventListener('mouseup', pagina4Show, false);
	document.getElementById('btnColofon').addEventListener('mouseup', pagina5Show, false);
	initRecording();
};

function hideAll() {
	$('section').attr('class', 'hide');
	$('.navbtn').attr('class', 'navbtn up');
	clearGeo();
}
function pagina1Show() {
	hideAll();
	$('#pagina1').attr('class', 'show');
	$('#btnEi').attr('class', 'navbtn down');
};
function pagina2Show() {
	hideAll();
	$('#pagina2').attr('class', 'show');
	$('#btnShine').attr('class', 'navbtn down');
};
function pagina3Show() {
	hideAll();
	$('#pagina3').attr('class', 'show');
	$('#btnMic').attr('class', 'navbtn down');
};
function pagina4Show() {
	hideAll();
	$('#pagina4').attr('class', 'show');
	$('#btnKompas').attr('class', 'navbtn down');
	watchGeo();
};
function pagina5Show() {
	hideAll();
	$('#pagina5').attr('class', 'show');
	$('#btnColofon').attr('class', 'navbtn down');
};

// Pagina4: kompas en w-ei-zer functies ---------------------------------------
function clearGeo(){
	console.log('clearGeo');
	navigator.geolocation.clearWatch(geoObject);
	navigator.compass.clearWatch(comObject);
	$('#kompas').css({transform: 'rotateZ(0deg)'});
	$('#weizer').css({transform: 'rotateZ(0deg)'});
	$('#afstand').html('geen info');
	$('#geo').html('');
	$('#com').html('');
};
function watchGeo(){
	console.log('watchGeo');
	var geoOptions = { maximumAge: 0, timeout: 5000 , enableHighAccuracy:true};
	geoObject = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
	var comOptions = { frequency: 100 }; // either set frequency or filter (= deviation)
	comObject = navigator.compass.watchHeading(comSuccess, comError, comOptions);
};
function geoSuccess(geoPosition){
	var eiLat  = 51.686866,
		eiLon  =  5.288178,
		geoLat = geoPosition.coords.latitude,
		geoLon = geoPosition.coords.longitude;
// Bron: http://www.movable-type.co.uk/scripts/latlong.html
	var R = 6371000; // radius aarde in meters
	var φ1 = toRadians(geoLat);
	var φ2 = toRadians(eiLat);
	var λ1 = toRadians(geoLon);
	var λ2 = toRadians(eiLon);
	var Δφ = toRadians(eiLat-geoLat);
	var Δλ = toRadians(eiLon-geoLon);

	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	        Math.cos(φ1) * Math.cos(φ2) *
	        Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R * c;
	if(d<999.5) {
		$('#afstand').html(Math.round(d) + ' m');
	} else {
		$('#afstand').html(Math.round(d/1000) + ' km');
	}

	var y = Math.sin(λ2-λ1) * Math.cos(φ2);
	var x = Math.cos(φ1)*Math.sin(φ2) -
	        Math.sin(φ1)*Math.cos(φ2)*Math.cos(λ2-λ1);
	var gpsBearing = toDegrees(Math.atan2(y, x));
	var eiBearing  = myHeading + gpsBearing;

	$('#weizer').css({transform: 'rotateZ(' + eiBearing + 'deg)'});

	// var geoText  = 'Latitude: ' + geoPosition.coords.latitude;
	// 	geoText += '\n<br>Longitude: ' + geoPosition.coords.longitude;
	// 	geoText += '\n<br>gpsBearing: ' + gpsBearing;
	// 	geoText += '\n<br>eiBearing: ' + eiBearing;
	// $('#geo').html(geoText);
}
function toRadians(degrees) {
	return degrees * Math.PI/180;
}
function toDegrees(radians) {
	return radians * 180/Math.PI;
}
function geoError(error){
	clearGeo();
	var msg = 'Controleer of plaatsbepaling op jouw smartphone AAN staat en dat je een goed bereik hebt.'
			+ '\n(' + error.code + ': ' + error.message + ')';
	navigator.notification.alert(msg, alertCB, 'Locatie fout', 'Oops');
	console.log('geoError: ' + error.code + '=\n' + error.message);
}
function comSuccess(heading){
	myHeading = -heading.trueHeading;
	$('#kompas').css({transform: 'rotateZ(' + myHeading + 'deg)'});
	// var comText  = 'Magnetic heading: ' + heading.magneticHeading;
	// comText += '<br>trueHeading: ' + heading.trueHeading;
	// $('#com').html(comText);
}
function comError(error){
	clearGeo();
	var msg = 'Controleer of plaatsbepaling op jouw smartphone AAN staat en dat je een goed bereik hebt.'
			+ '\n(' + error.code + ': ' + error.message + ')';
	navigator.notification.alert(msg, alertCB, 'Kompas fout', 'Oops');
	console.log('comError: ' + error.code + '=\n' + error.message);
}
function alertCB() {
	//do nothing
	console.log('alertCB invoked');
}

// Einde javascript -----------------------------------------------------------