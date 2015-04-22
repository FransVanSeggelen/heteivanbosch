var media;
var secondsRecorded = 0;
var maxSeconds = 15;
var interval;
var lastState;
var filename = 'heteivanbosch';
var filetype = 'audio/';
var filepath = 0;
var uploadURL = 'http://shinefestival.herokuapp.com';

function initRecording() {
    updateCurrentState('idle');
    updateSecondsRecordedUI();
    if(isMobile.Android()) {
        filename += '.amr';
        filetype += 'AMR';
        filepath  = LocalFileSystem.PERSISTENT;
    }
    if(isMobile.iOS()) {
        filename += '.wav';
        filetype += 'wav';
        filepath  = LocalFileSystem.TEMPORARY;
    }

    $('#pagina3 div').on('click', function(e){
        if(!($(this).hasClass('not'))) {
            switch ($(this).attr('id'))
            {
                case 'btnStart':
                    if(lastState == 'recording') {
                        stopRecording();
                    } else {
                        startRecording();
                    }
                    break;
                case 'btnPlay':
                    if(lastState == 'playing') {
                        stopPlaying();
                    } else {
                        startPlaying();
                    }
                    break;
                case 'btnSend':
                    sendRecordedFile();
                    break;
            }
        }
    });
};

function startRecording(){
    updateCurrentState('recording');
    media = createMedia();
    media.startRecord();
    interval = setInterval(function(){
        secondsRecorded++;
        updateSecondsRecordedUI();
        if(secondsRecorded >= maxSeconds){
            stopRecording();
        }
    }, 1000);
}

function createMedia(){
    return new Media(filename, 
        function(){
            if(lastState == 'playing'){
                updateCurrentState('recorded');
            }
        }, 
        function(error){
            var msg = 'Het Ei kan media niet gebruiken.'
                    + '\n(' + error.code + ': ' + error.message + ')';
            navigator.notification.alert(msg, alertCB, 'Media fout', 'Sorry');
            console.log('mediaError: ' + error.code + '=\n' + error.message);
        }
    );
};

function updateSecondsRecordedUI(){
    var secondsLeft = maxSeconds - secondsRecorded;
    var text = (secondsLeft < 10 ? '0' : '') + secondsLeft;
    $('#textSecondsLeft').html('00:' + text);
}

function stopRecording(){
    if(interval){
        clearInterval(interval);
    }
    updateCurrentState('recorded');
    secondsRecorded = 0;
//    updateSecondsRecordedUI();
    if(media){
        media.stopRecord();
        media.release();
//        media = undefined;
    }
}

function startPlaying(){
    if(lastState != 'playing') {
        updateCurrentState('playing');
        media = createMedia();
        // media.getCurrentPosition(function(pos){console.log(pos + ' sec');});
        // console.log(media.getDuration());
        media.play();
    }
}
function stopPlaying(){
    if(media) {
        updateCurrentState('recorded');
		media.stop();
	}
}

function sendRecordedFile(){
    updateCurrentState('sending');
    $('#textSecondsLeft').html('Verzenden...');

    window.requestFileSystem(filepath, 0, function (fileSystem) {
        fileSystem.root.getFile(filename, { create: false, exclusive: false }, function(fileEntry){
            var options = new FileUploadOptions();
            options.fileKey = "recordedAudio";
            options.fileName = filename;
            options.mimeType = filetype;
            options.chunkedMode = false;

            var ft = new FileTransfer();
            ft.upload(fileEntry.toURL(), uploadURL, 
                function(res){
                    $('#textSecondsLeft').html('Verzonden!');
                    updateCurrentState('idle');
                }, function(err){
                    $('#textSecondsLeft').html('Oops, mislukt.');
                    updateCurrentState('recorded');
                }, options);
        });
    });
}

function updateCurrentState(status){
    lastState = status;
    switch (status){
        case 'idle':
            $('#btnStart').attr('class', 'up');
            $('#btnPlay').attr('class', 'not');
            $('#btnSend').attr('class', 'not');
            break;
        case 'recorded':
            $('#btnStart').attr('class', 'up');
            $('#btnPlay').attr('class', 'up');
            $('#btnSend').attr('class', 'up');
            break;
        case 'recording':
            $('#btnStart').attr('class', 'down');
            $('#btnPlay').attr('class', 'not');
            $('#btnSend').attr('class', 'not');
            break;
        case 'playing':
            $('#btnStart').attr('class', 'not');
            $('#btnPlay').attr('class', 'down');
            $('#btnSend').attr('class', 'not');
            break;
        case 'sending':
            $('#btnStart').attr('class', 'not');
            $('#btnPlay').attr('class', 'not');
            $('#btnSend').attr('class', 'down');
            break;
    }
}