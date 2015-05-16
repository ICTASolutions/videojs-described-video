var describedVideoMaker = require('./src/described-video-maker.js');
var DescribedVideoButton = require('./src/described-video-button.js');
var videojs = require('video.js');

var describedVideo = function describedVideo(list) {
  this.describedVideo = describedVideoMaker(this, list);

  // Add the description selector button
  if ( this.describedVideo  ) {
    describedVideoButton = new DescribedVideoButton( this, {
    });

    // Add the button to the control bar object and the DOM
    this.controlBar.describedVideoButton = this.controlBar.addChild( describedVideoButton );
  }
};

module.exports = describedVideo;
videojs.plugin('describedVideo', describedVideo);
