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
};
function pagina5Show() {
	hideAll();
	$('#pagina5').attr('class', 'show');
	$('#btnColofon').attr('class', 'navbtn down');
};