var media;
var secondsRecorded = 0;
var maxSeconds = 15;
var interval;
var lastState;
var filename = 'heteivanbosch';
var filetype = 'audio/';
var filepath = LocalFileSystem.PERSISTENT;
var uploadURL = 'http://shinefestival.herokuapp.com';

function initRecording() {
    console.log('initRecording' + uploadURL);
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
        console.log('preSwitch');
        if(!($(this).hasClass('not'))) {
            switch ($(this).attr('id'))
            {
                case 'btnStart':
                    console.log('btnStart');
                    if(lastState == 'recording') {
                        stopRecording();
                    } else {
                        startRecording();
                    }
                    break;
                case 'btnPlay':
                    console.log('btnPlay');
                    playRecordedFile();
                    break;
                case 'btnSend':
                    console.log('btnSend');
                    sendRecordedFile();
                    break;
            }
        }
    });
};

function startRecording(){
    console.log('startRecording');
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
    console.log('createMedia');
    return new Media(filename, 
        function(){
            if(lastState == 'playing'){
                updateCurrentState('recorded');
            }
        }, 
        function(err){
            alert(err.message); 
        }
    );
};

function updateSecondsRecordedUI(){
    console.log('updateSecondsRecordedUI');
    var secondsLeft = maxSeconds - secondsRecorded;
    var text = (secondsLeft < 10 ? '0' : '') + secondsLeft;
    $('#textSecondsLeft').html('00:' + text);
}

function stopRecording(){
    console.log('stopRecording');
    if(interval){
        clearInterval(interval);
    }

    updateCurrentState('recorded');

    secondsRecorded = 0;
    updateSecondsRecordedUI();

    if(media){
        media.stopRecord();
        media.release();
        media = undefined;
    }
}

function playRecordedFile(){
    console.log('playRecordedFile');
    if(lastState != 'playing') {
        updateCurrentState('playing');
        media = createMedia();
        media.getCurrentPosition(function(pos){console.log(pos + ' sec');});
        console.log(media.getDuration());
        media.play();
    }
}

function sendRecordedFile(){
    console.log('sendRecordedFile');
    updateCurrentState('sending');
    $('#textSecondsLeft').html('Verzenden...');

    console.log('temp: ' + LocalFileSystem.TEMPORARY);
    console.log('pers: ' + LocalFileSystem.PERSISTENT);
    console.log('path: ' + filepath);
    console.log('name: ' + filename);
    console.log('type: ' + filetype);
    alert('temp: ' + LocalFileSystem.TEMPORARY + '\npers: ' + LocalFileSystem.PERSISTENT + '\npath: ' + filepath + '\nname: ' + filename + '\ntype: ' + filetype);
    window.requestFileSystem(filepath, 0, function (fileSystem) {
        console.log('Tussen request en get');
        fileSystem.root.getFile(filename, { create: false, exclusive: false }, function(fileEntry){
            console.log('Na get');
            var options = new FileUploadOptions();
            options.fileKey = "recordedAudio";
            options.fileName = filename;
            options.mimeType = filetype;
            options.chunkedMode = false;

            console.log('Net voor ft');
            var ft = new FileTransfer();
            console.log('Net voor upload1:' + fileEntry.toURL());
            console.log('Net voor upload2:' + uploadURL);
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
    console.log('updateCurrentState');
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
            $('#btnStart').attr('class', 'up');
            $('#btnPlay').attr('class', 'not');
            $('#btnSend').attr('class', 'not');
            break;
        case 'playing':
            $('#btnStart').attr('class', 'not');
            $('#btnPlay').attr('class', 'up');
            $('#btnSend').attr('class', 'not');
            break;
        case 'sending':
            $('#btnStart').attr('class', 'not');
            $('#btnPlay').attr('class', 'not');
            $('#btnSend').attr('class', 'not');
            break;
    }
}