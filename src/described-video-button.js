var videojs = require('video.js');

/***********************************************************************************
 * Define the button to control enabling/disabling described video playback
 ***********************************************************************************/
/**
 * Button to toggle between described and non-described videos
 * @param {vjs.Player|Object} player
 * @param {Object=} options
 * @class
 * @constructor
 */
 DescribedVideoButton = videojs.Button.extend({
  /** @constructor */
  init: function(player, options){
    videojs.Button.call(this, player, options);

    this.on(player, 'describedvideochange', this.onChangeDescription);
  }
});

DescribedVideoButton.prototype.buttonText = 'Described Video';

DescribedVideoButton.prototype.buildCSSClass = function(){
  return 'described-video-button ' + videojs.Button.prototype.buildCSSClass.call(this);
};

// OnClick - Toggle between described and not described
DescribedVideoButton.prototype.onClick = function(){
  // Call the player.changeDescription method
  this.player().describedVideo.toggle();
};

// onChangeDescription - Change classes of the element so it can change appearance
DescribedVideoButton.prototype.onChangeDescription = function(){
  if ( this.player().describedVideo.isDescribed() ){
    this.addClass('is-described');
    this.el_.children[0].children[0].innerHTML = this.localize(this.buttonText + ', disable description');
  } else {
    this.removeClass('is-described');
    this.el_.children[0].children[0].innerHTML = this.localize(this.buttonText + ', enable description');
  }
};

module.exports = DescribedVideoButton;
