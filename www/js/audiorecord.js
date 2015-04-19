var media;
var secondsRecorded = 0;
var maxSeconds = 15;
var interval;
var lastState;
var filename = 'heteivanbosch';
var uploadURL = 'http://shinefestival.herokuapp.com';

function initRecording() {
    console.log('initRecording');
    updateCurrentState('idle');
    updateSecondsRecordedUI();
    if(isMobile.Android()) filename += '.amr';
    if(isMobile.iOS()) filename += '.wav';

    $('#pagina3 div').on('click', function(e){
        console.log('preSwitch');
        switch ($(this).attr('id'))
        {
            case 'btnStart':
            console.log('btnStart');
                if(lastState == 'recording') {
                    $('#btnStart').attr('class', 'up');
                    stopRecording();
                } else {
                    $('#btnStart').attr('class', 'down');
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
    //var secondsLeft = maxSeconds - secondsRecorded;
    var text = (secondsRecorded < 10 ? '0' : '') + secondsRecorded;
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
        media.play();
    }
}

function sendRecordedFile(){
    console.log('sendRecordedFile');
    updateCurrentState('idle');
    $('#textSendStatus').html('uploading...');

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getFile(filename, { create: false, exclusive: false }, function(fileEntry){
            var options = new FileUploadOptions();
            options.fileKey = "recordedAudio";
            options.fileName = filename;
            if(isMobile.Android){
                options.mimeType = 'audio/amr';
            }
            if(isMobile.iOS){
                options.mimeType = 'audio/wav';
            }
            options.chunkedMode = false;

            var ft = new FileTransfer();
            ft.upload(fileEntry.toURL(), uploadURL, 
                function(res){
                    $('#textSendStatus').html('Verzonden!');
                }, function(err){
                    alert('oh no!');
                    $('#textSendStatus').html(err.body);
                }, options);
        });
    });
}

function updateCurrentState(status){
    console.log('updateCurrentState');
    lastState = status;
    switch (status){
        case 'idle':
            $('#btnStart').prop('disabled', false);
            $('#btnPlay').prop('disabled', true);
            $('#btnSend').prop('disabled', true);
            break;
        case 'recorded':
            $('#btnStart').prop('disabled', false);
            $('#btnPlay').prop('disabled', false);
            $('#btnSend').prop('disabled', false);
            break;
        case 'recording':
            $('#btnStart').prop('disabled', false);
            $('#btnPlay').prop('disabled', true);
            $('#btnSend').prop('disabled', true);
            break;
        case 'playing':
            $('#btnStart').prop('disabled', true);
            $('#btnPlay').prop('disabled', false);
            $('#btnSend').prop('disabled', true);
            break;
    }
}