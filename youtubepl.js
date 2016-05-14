//utilizes youtube player API
var YoutubePlaylist = function() {

    
    var instance = this;
    this.scriptTag = null;
    this.dom = null;
    this.playlist = [
	//"dH3owQnIdAs",
	//"UChU4yqlhnw",
	//"ta-Z_psXODw"
    ];
    this.currentVideo = 0;
    this.width = '480';
    this.height = '320';
    this.player = null;
    this.isPaused = false;
    this.noSongLoaded = false;
    
    this.playerReady = function(event) {
	console.log("Youtube constructor called?");
	instance.dom = document.getElementById("YoutubePlaylist");
	instance.startNewVideo();
    }
    
    this.startNewVideo = function() {
	if (instance.currentVideo >= instance.playlist.length ||
	    instance.currentVideo < 0)
	{
	    return;
	}

	//instance.player.cueVideoById({
	instance.player.loadVideoById({
	    "videoId": instance.playlist[instance.currentVideo],
	    "suggestedQuality":"small"
	});

	instance.playVideo();
    }

    this.videoEvent = function(event) {
	
	instance.noSongLoaded = false;
	
	if (event.data == -1) {
	    instance.noSongLoaded = true;
	}
	else if (event.data == 0) {
	    //video finished
	    instance.skipToNextVideo();
	}
	else if (event.data == 2) {
	    instance.isPaused = true;
	}
	else if (event.data == 1) {
	    instance.isPaused = false;
	}
	else if (event.data == 5) {
	    instance.startNewVideo();
	}
    }
    
    //cleanup when the plugin is disabled
    this.destroy = function() {
	instance.player.destroy();
	instance.scriptTag.parentNode.removeChild(instance.scriptTag);
	instance.scriptTag = null;
    }
    
    
    //media controls from here on out
    
    
    this.playVideo = function() {
	instance.player.playVideo();
    }
    
    this.pauseVideo = function() {
	instance.player.pauseVideo();
    }
    
    this.stopVideo = function() {
	instance.player.stopVideo();
    }
    
    this.getPauseState = function() {
	return instance.isPaused;
    }
    
    this.getCurVideo = function() {
	return instance.currentVideo;
    }
    
    this.muteVideo = function() {
	if (!instance.player.isMuted())
	    instance.player.mute();
	else
	    instance.player.unMute();
    }
    
    this.playPauseToggle = function() {
	if (instance.noSongLoaded) {
	    instance.startNewVideo();
	} else {
	    if (instance.getPauseState())
		instance.player.playVideo();
	    else
		instance.player.pauseVideo();
	}
    }
    
    
    this.skipToNextVideo = function() {
	if (instance.currentVideo < instance.playlist.length - 1) {
	    instance.currentVideo++;
	    instance.startNewVideo();
	}
    }
    
    this.skipToPrevVideo = function() {
	if (instance.currentVideo > 0) {
	    instance.currentVideo--;
	    instance.startNewVideo();
	}
    }
    
    this.appendPlaylist = function(videoId) {
	instance.playlist.push(videoId);
    }
    
    this.getPlaylist = function() {
	var result = "";
	instance.playlist.forEach(function(id, index) {
	    result += id;
	    if (index < instance.playlist.length - 1)
		result += ","
	});
	return result;
    }
    
    this.playVideoNum = function(videoId) {
	console.log(instance.playlist);
	console.log(videoId);
	var trackNum = instance.playlist.indexOf(videoId);
	instance.currentVideo = parseInt(trackNum);
	instance.startNewVideo();
	return instance.currentVideo;
    }
    
    this.removeVideo = function(videoId) {
	var trackNum = instance.playlist.indexOf(videoId);
	instance.currentVideo -= (instance.currentVideo > trackNum);
	
	instance.playlist.splice(trackNum, 1);
	
	if (trackNum == instance.currentVideo) {
	    instance.startNewVideo();
	}
	return instance.playlist.length;
    }
    
    this.clearPlaylist = function() {
	instance.currentVideo = 0;
	instance.playlist = [];
	instance.stopVideo();
    }
    
    
    //add youtube API
    this.scriptTag = document.createElement('script');
    this.scriptTag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(this.scriptTag, firstScriptTag);
    
    //initialize the youtube player
    function initPlayer() {
    	//keep trying to initialize the player until the youtube API is fully
    	//loaded
	setTimeout(function() {
	    try {
		instance.player = new YT.Player('player', {
		    height: instance.height,
		    width: instance.width,
		    events: {
			'onReady': instance.playerReady,
			'onStateChange': instance.videoEvent
		    }
		});
		
	    } catch(e) {
		initPlayer();
	    }
	}, 100);
    }
    
    initPlayer();
};
