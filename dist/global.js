(function(f){var g;if(typeof window!=='undefined'){g=window}else if(typeof self!=='undefined'){g=self}g.videojsPlaylist=f()})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var videojs = (typeof window !== "undefined" ? window.videojs : typeof global !== "undefined" ? global.videojs : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
var playItem = require('./playitem.js');
var isArray = Array.isArray || function(array) {
  return Object.prototype.toString.call(array) === '[object Array]';
};
var indexInSources = function(arr, src) {
  var i = 0;
  var j = 0;
  var item;
  var source;

  for (; i < arr.length; i++) {
    item = arr[i];
    for (j = 0; j < item.sources.length; j++) {
      source = item.sources[j];
      if (source && (source === src || source.src === src)) {
        return i;
      }
    }
  }

  return -1;
};

// factory method to return a new describedVideo with the following API
// describedVideo(["a", "b"]) // setter, ["a", "b"]
// describedVideo() // getter, ["a", "b"]
// describedVideo.currentItem() // getter, 0
// describedVideo.currentItem(1) // setter, 1
// describedVideo.described() // "b"
// describedVideo.original() // "a"
// describedVideo.toggle() // "b"
// describedVideo.isDescribed() // true
var describedVideoMaker = function(player, plist) {
  //NOTE: The currentIndex logic is here to allow future support of more than
  //      one described video (e.g. in different languages)
  var currentIndex = -1;
  var list = [];
  var loadFirstItem = function loadFirstItem() {
    if (list.length > 0) {
      currentIndex = 0;
      playItem(player, list[0]);
    } else {
      currentIndex = -1;
    }
  };

  if (plist && isArray(plist)) {
    list = plist.slice();
  }

  var describedVideo = function describedVideo(plist) {
    if (plist && isArray(plist)) {
      list = plist.slice();
      loadFirstItem();
    }

    return list.slice();
  };

  describedVideo.currentItem = function item(index) {
    var src;

    if (typeof index === 'number' &&
        currentIndex !== index &&
        index >= 0 &&
        index < list.length) {
      currentIndex = index;
      playItem(player, list[currentIndex]);
      return currentIndex;
    }

    src = player.currentSrc() || '';
    currentIndex = describedVideo.indexOf(src);

    return currentIndex;
  };

  // item can be either
  //  * a string
  //  * an array of sources, which are either strings or {src, type} objects
  //  * a describedVideo item
  describedVideo.contains = function contains(item) {
    return player.describedVideo.indexOf(item) !== -1;
  };

  describedVideo.indexOf = function indexOf(item) {
    var ret = -1;
    var sources;
    var source;
    var i;

    if (typeof item === 'string') {
      ret = indexInSources(list, item);
    } else {
      if (isArray(item)) {
        sources = item;
      } else {
        sources = item.sources;
      }

      for (i = 0; i < sources.length; i++) {
        source = sources[i];
        if (typeof source === 'string') {
          ret = indexInSources(list, source);
        } else {
          ret = indexInSources(list, source.src);
        }

        if (ret !== -1) {
          break;
        }
      }
    }

    return ret;
  };

  describedVideo.described = function described() {
    var prevIndex = currentIndex;
    currentIndex = Math.min(1, list.length - 1); // Described is the second entry (if it exists!)
    if (prevIndex === currentIndex) {
      return;
    }
    playItem(player, list[currentIndex]);
    return list[currentIndex];
  };

  describedVideo.original = function original() {
    var prevIndex = currentIndex;
    currentIndex = 0; // Original is the first entry
    if (prevIndex === currentIndex) {
      return;
    }
    playItem(player, list[currentIndex]);
    return list[currentIndex];
  };

  describedVideo.isDescribed = function isDescribed() {
    return ( currentIndex > 0 );
  };

  describedVideo.toggle = function toggle() {
    if ( this.isDescribed() ) {
      return this.original();
    } else {
      return this.described();
    }
  };

  loadFirstItem();

  return describedVideo;
};

module.exports = describedVideoMaker;

},{"./playitem.js":3}],3:[function(require,module,exports){
var clearTracks = function(player) {
  var remoteTT = player.remoteTextTracks();
  var i = (remoteTT && remoteTT.length) || 0;

  while (i--) {
    player.removeRemoteTextTrack(remoteTT[i]);
  }
};

var playItem = function(player, obj) {
  var i, replay;

  replay = !player.paused() || player.ended();

  player.poster(obj.poster || '');
  player.src(obj.sources);

  clearTracks(player);

  i = (obj.textTracks && obj.textTracks.length) || 0;
  while (i--) {
    player.addRemoteTextTrack(obj.textTracks[i]);
  }

  if (replay) {
    player.play();
  }

  player.trigger('describedvideochange');

  return player;
};

module.exports = playItem;
module.exports.clearTracks = clearTracks;

},{}],4:[function(require,module,exports){
(function (global){
var describedVideoMaker = require('./src/described-video-maker.js');
var DescribedVideoButton = require('./src/described-video-button.js');
var videojs = (typeof window !== "undefined" ? window.videojs : typeof global !== "undefined" ? global.videojs : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/described-video-button.js":1,"./src/described-video-maker.js":2}]},{},[4])(4)
});