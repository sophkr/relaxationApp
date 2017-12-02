var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    startVideos();
}

function startVideos(){
     $("#special-content").remove();
      $("body").append("<div id=\"special-content\"><\div>");
      var player = new YT.Player('special-content', {
          height: '390',
          width: '640',
    	  theme: 'dark',
		  color: 'white',
		  loadPlaylist: {
		  listType: 'playlist',
		  list: '[8B03F998924DA45B]',
	     
			  
		},
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });

      function onPlayerReady(event) {
         event.target.loadPlaylist('8B03F998924DA45B');
      }
     
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !finished) {
          finished = true;
        }
      }
		
 
};
