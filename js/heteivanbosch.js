// Globale variabelen
var isMobile = false;
var geoObject;
var comObject;

// Wait for device to be ready loading everything
$(document).ready(function() {
	isMobile = {
		Android: function() { return navigator.userAgent.match(/Android/i); }, 
		BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, 
		iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, 
		Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, 
		Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, 
		any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
	};
	if (isMobile.any()) {
		document.addEventListener('deviceready', onDeviceReady, false);
	} else {
		onDeviceReady();
	};
});

function onDeviceReady(){
    $('#btnEi').on('click', function() {pagina1Show()});
    $('#btnShine').on('click', function() {pagina2Show()});
    $('#btnMic').on('click', function() {pagina3Show()});
    $('#btnKompas').on('click', function() {pagina4Show()});
    $('#btnColofon').on('click', function() {pagina5Show()});
	initRecording();
};

function hideAll() {
	$('section').attr('class', 'hide');
	$('nav div').attr('class', 'up');
	clearGeo();
}
function pagina1Show() {
	hideAll();
	$('#pagina1').attr('class', 'show');
	$('#btnEi').attr('class', 'down');
};
function pagina2Show() {
	hideAll();
	$('#pagina2').attr('class', 'show');
	$('#btnShine').attr('class', 'down');
};
function pagina3Show() {
	hideAll();
	$('#pagina3').attr('class', 'show');
	$('#btnMic').attr('class', 'down');
};
function pagina4Show() {
	hideAll();
	$('#pagina4').attr('class', 'show');
	$('#btnKompas').attr('class', 'down');
	watchGeo();
	watchCom();
};
function pagina5Show() {
	hideAll();
	$('#pagina5').attr('class', 'show');
	$('#btnColofon').attr('class', 'down');
};

// Pagina4: kompas en w-ei-zer functies ---------------------------------------
function clearGeo(){
	navigator.geolocation.clearWatch(geoObject);
	navigator.compass.clearWatch(comObject);
	$('#kompas').css({transform: 'rotateZ(0deg)'});
	$('#weizer').css({transform: 'rotateZ(0deg)'});
	$('#afstand').html('Zoeken...');
	$('#geo').html('');
	$('#com').html('');
};
function watchGeo(){
	var geoOptions = { maximumAge: 0, timeout: 5000, enableHighAccuracy:true};
	geoObject = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
};
function watchCom(){
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
	var bearing = toDegrees(Math.atan2(y, x));
//	Let op: dit moet misschien nog van -180tot180 naar 0tot360 ??
	$('#weizer').css({transform: 'rotateZ(' + bearing + 'deg)'});

//	 var geoText  = 'Latitude: ' + geoPosition.coords.latitude;
//	 	geoText += '\n<br>Longitude: ' + geoPosition.coords.longitude;
//	 	geoText += '\n<br>Bearing: ' + bearing;
//	 $('#geo').html(geoText);
}
function toRadians(degrees) {
	return degrees * Math.PI/180;
}
function toDegrees(radians) {
	return radians * 180/Math.PI;
}
function geoError(error){	// Beter geen alert maar htmltext of geen bericht
//	var msg = 'Het Ei kan even niet jouw plaats bepalen. Probeer zo nog eens.'
//			+ '\n(' + error.code + ': ' + error.message + ')';
//	navigator.notification.alert(msg, alertCB, 'Locatie fout', 'Sorry');
//	console.log('geoError: ' + error.code + '=\n' + error.message);
	$('#afstand').html('Zoeken...');
}
function comSuccess(heading){
	var myHeading = heading.magneticHeading * -1;
	$('#kompas').css({transform: 'rotateZ(' + myHeading + 'deg)'});
//	 var comText  = 'Magnetic heading: ' + heading.magneticHeading;
//	 	comText += '<br>trueHeading: ' + heading.trueHeading;
//	 $('#com').html(comText);
}
function comError(error){	// Beter geen alert maar htmltext of geen bericht
//	var msg = 'Het Ei kan even niet jouw kompas gebruiken. Probeer zo nog eens.'
//			+ '\n(' + error.code + ': ' + error.message + ')';
//	navigator.notification.alert(msg, alertCB, 'Kompas fout', 'Sorry');
//	console.log('comError: ' + error.code + '=\n' + error.message);
	$('#afstand').html('Zoeken...');
}
function alertCB() {
	//do nothing
	console.log('alertCB invoked');
}

// Einde javascript -----------------------------------------------------------
