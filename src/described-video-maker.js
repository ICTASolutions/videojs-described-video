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
