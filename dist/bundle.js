(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsPlaylist = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function autoadvance(player, timeout) {
  var resetadvance = function resetadvance() {
    if (player.playlist._timeoutId) {
      window.clearTimeout(player.playlist._timeoutId);
    }

    if (player.playlist._ontimeout) {
      player.off('ended', player.playlist._ontimeout);
    }

    player.playlist._timeoutId = null;
    player.playlist._ontimeout = null;
  };

  // we want to cancel the auto advance or auto advance was called with a bogus value
  if (typeof timeout !== 'number' || timeout !== timeout || timeout < 0 || timeout === Infinity) {
    return resetadvance();
  }

  var ontimeout = function() {
    player.playlist._timeoutId = window.setTimeout(function() {
      resetadvance();
      player.playlist.next();
    }, timeout);
  };

  // we called auto advance while an auto-advance was in progress
  if (player.playlist._timeoutId) {
    return resetadvance();
  }

  // we are starting a new video and don't have a timeout handler for it
  if (!player.playlist._ontimeout) {
    player.playlist._ontimeout = ontimeout;
    return player.one('ended', ontimeout);
  }

  // we want to reset the timeout for auto advance
  resetadvance();
  player.playlist._ontimeout = ontimeout;
  player.one('ended', ontimeout);
};

},{}],2:[function(require,module,exports){
var setupAutoadvance = require('./autoadvance.js');

var clearTracks = function(player) {
  var remoteTT = player.remoteTextTracks();
  var i = (remoteTT && remoteTT.length) || 0;

  while (i--) {
    player.removeRemoteTextTrack(remoteTT[i]);
  }
};

var playItem = function(player, autoadvanceTimeout, obj) {
  var i, replay;

  replay = !player.paused() || player.ended();

  player.poster(obj.poster);
  player.src(obj.sources);

  clearTracks(player);

  i = (obj.textTracks && obj.textTracks.length) || 0;
  while (i--) {
    player.addRemoteTextTrack(obj.textTracks[i]);
  }

  if (replay) {
    player.play();
  }

  setupAutoadvance(player, autoadvanceTimeout);

  return player;
};

module.exports = playItem;
module.exports.clearTracks = clearTracks;

},{"./autoadvance.js":1}],3:[function(require,module,exports){
var playItem = require('./playitem.js');
var setupAutoadvance = require('./autoadvance.js');
var isArray = Array.isArray || function(array) {
  return Object.prototype.toString.call(array) === '[object Array]';
};

// factory method to return a new playlist with the following API
// playlist(["a", "b", "c"]) // setter, ["a", "b", "c"]
// playlist() // getter, ["a", "b", "c"]
// playlist.currentItem() // getter, 0
// playlist.currentItem(1) // setter, 1
// playlist.next() // "c"
// playlist.previous() // "b"
var playlistMaker = function(player, plist) {
  var currentIndex = 0;
  var autoadvanceTimeout = null;
  var list = [];

  if (plist && isArray(plist)) {
    list = plist.slice();
  }

  var playlist = function playlist(plist) {
    if (plist && isArray(plist)) {
      list = plist.slice();
    }

    return list.slice();
  };

  playlist.currentItem = function item(index) {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      currentIndex = index;
      playItem(player, autoadvanceTimeout, list[currentIndex]);
      return currentIndex;
    }

    return currentIndex;
  };

  playlist.next = function next() {
    var prevIndex = currentIndex;
    // make sure we don't go past the end of the playlist
    currentIndex = Math.min(currentIndex + 1, list.length - 1);
    if (prevIndex === currentIndex) {
      return;
    }
    playItem(player, autoadvanceTimeout, list[currentIndex]);
    return list[currentIndex];
  };

  playlist.previous = function previous() {
    var prevIndex = currentIndex;
    // make sure we don't go past the start of the playlist
    currentIndex = Math.max(currentIndex - 1, 0);
    if (prevIndex === currentIndex) {
      return;
    }
    playItem(player, autoadvanceTimeout, list[currentIndex]);
    return list[currentIndex];
  };

  playlist.autoadvance = function autoadvance(timeout) {
    autoadvanceTimeout = timeout;

    setupAutoadvance(player, autoadvanceTimeout);
  };

  if (list.length) {
    playlist.currentItem(0);
  }

  return playlist;
};

module.exports = playlistMaker;

},{"./autoadvance.js":1,"./playitem.js":2}],4:[function(require,module,exports){
(function (global){
var playlistMaker = require('./src/playlist-maker.js');
var videojs = (typeof window !== "undefined" ? window.videojs : typeof global !== "undefined" ? global.videojs : null);

var playlist = function playlist(list) {
  this.playlist = playlistMaker(this, list);
};

module.exports = playlist;
videojs.plugin('playlist', playlist);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/playlist-maker.js":3}]},{},[4])(4)
});