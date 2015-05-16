var extend = require('node.extend');
var q = QUnit;
var oldTimeout;
var describedVideoMaker = require('../src/described-video-maker.js');
var playerProxy = require('./player-proxy.js');
var isArray = Array.isArray || function(array) {
  return Object.prototype.toString.call(array) === '[object Array]';
};
var videoList = [{
  sources: [{
    src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
    type: 'video/mp4'
  }],
    poster: 'http://media.w3.org/2010/05/sintel/poster.png'
}, {
  sources: [{
    src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
    type: 'video/mp4'
  }],
    poster: 'http://media.w3.org/2010/05/bunny/poster.png'
}];

q.module('describedVideo', {
  setup: function() {
    oldTimeout = window.setTimeout;
    window.setTimeout = Function.prototype;
  },
  teardown: function() {
    window.setTimeout = oldTimeout;
  }
});

q.test('describedVideoMaker takes a player and a list and returns a describedVideo', function() {
  var describedVideo = describedVideoMaker(playerProxy, []);

  q.ok(describedVideo, 'we got a describedVideo');
  q.equal(typeof describedVideo, 'function', 'describedVideo is a function');
  q.equal(typeof describedVideo.currentItem, 'function', 'we have a currentItem function');
  q.equal(typeof describedVideo.next, 'function', 'we have a next function');
  q.equal(typeof describedVideo.previous, 'function', 'we have a previous function');
  q.equal(typeof describedVideo.described, 'function', 'we have a described function');
  q.equal(typeof describedVideo.original, 'function', 'we have an original function');
  q.equal(typeof describedVideo.toggle, 'function', 'we have a toggle function');
});

q.test('describedVideoMaker can either take nothing or only an Array', function() {
  var describedVideo1 = describedVideoMaker(playerProxy);
  var describedVideo2 = describedVideoMaker(playerProxy, 'foo');
  var describedVideo3 = describedVideoMaker(playerProxy, {foo: [1,2,3]});

  q.deepEqual(describedVideo1(), [], 'if given no initial array, default to an empty array');
  q.deepEqual(describedVideo2(), [], 'if given no initial array, default to an empty array');
  q.deepEqual(describedVideo3(), [], 'if given no initial array, default to an empty array');
});


q.test('describedVideo() is a getter and setter for the list', function() {
  var describedVideo = describedVideoMaker(playerProxy, [1,2,3]);

  q.deepEqual(describedVideo(), [1,2,3], 'equal to input list');
  q.deepEqual(describedVideo([1,2,3,4,5]), [1,2,3,4,5], 'equal to input list, arguments ignored');
  q.deepEqual(describedVideo(), [1,2,3,4,5], 'equal to input list');

  var list = describedVideo();
  list.unshift(10);

  q.deepEqual(describedVideo(), [1,2,3,4,5], 'changing the list did not affect the describedVideo');
  q.notDeepEqual(describedVideo(), [10,1,2,3,4,5], 'changing the list did not affect the describedVideo');

});

q.test('describedVideo() should only accept an Array as a new describedVideo', function() {
  var describedVideo = describedVideoMaker(playerProxy, [1,2,3]);

  q.deepEqual(describedVideo('foo'), [1,2,3], 'when given "foo", it should be treated as a getter');
  q.deepEqual(describedVideo({foo: [1,2,3]}), [1,2,3], 'when given {foo: [1,2,3]}, it should be treated as a getter');
});

q.test('describedVideo.currentItem() works as expected', function() {
  var player = extend(true, {}, playerProxy);
  var describedVideo = describedVideoMaker(player, videoList);
  var src;

  player.src = function(s) {
    if (s) {
      if (typeof s === 'string') {
        src = s;
      } else if (isArray(s)) {
        return player.src(s[0]);
      } else {
        return player.src(s.src);
      }
    }
  };

  player.currentSrc = function() {
    return src;
  };

  src = videoList[0].sources[0].src;

  q.equal(describedVideo.currentItem(), 0, 'begin at the first item, item 0');

  q.equal(describedVideo.currentItem(2), 2, 'setting to item 2 gives us back the new item index');
  q.equal(describedVideo.currentItem(), 2, 'the current item is now 2');

  q.equal(describedVideo.currentItem(5), 2, 'cannot change to an out-of-bounds item');
  q.equal(describedVideo.currentItem(-1), 2, 'cannot change to an out-of-bounds item');
  q.equal(describedVideo.currentItem(null), 2, 'cannot change to an invalid item');
  q.equal(describedVideo.currentItem(NaN), 2, 'cannot change to an invalid item');
  q.equal(describedVideo.currentItem(Infinity), 2, 'cannot change to an invalid item');
  q.equal(describedVideo.currentItem(-Infinity), 2, 'cannot change to an invalid item');
});

q.test('describedVideo.currentItem() returns -1 with an empty describedVideo', function() {
  var describedVideo = describedVideoMaker(playerProxy, []);

  q.equal(describedVideo.currentItem(), -1, 'we should get a -1 with an empty describedVideo');
});

q.test('describedVideo.currentItem() does not change items if same index is given', function() {
  var player = extend(true, {}, playerProxy);
  var sources = 0;
  var describedVideo;
  var src;

  player.src = function(s) {
    if (s) {
      if (typeof s === 'string') {
        src = s;
      } else if (isArray(s)) {
        return player.src(s[0]);
      } else {
        return player.src(s.src);
      }
    }

    sources++;
  };

  player.currentSrc = function() {
    return src;
  };

  describedVideo = describedVideoMaker(player, videoList);

  q.equal(sources, 1, 'we switched to the first describedVideo item');
  sources = 0;


  q.equal(describedVideo.currentItem(), 0, 'we start at index 0');

  describedVideo.currentItem(0);
  q.equal(sources, 0, 'we did not try to set sources');

  describedVideo.currentItem(1);
  q.equal(sources, 1, 'we did try to set sources');

  describedVideo.currentItem(1);
  q.equal(sources, 1, 'we did not try to set sources');
});

q.test('describedVideo.contains() works as expected', function() {
  var player = extend(true, {}, playerProxy);
  var describedVideo = describedVideoMaker(player, videoList);
  player.describedVideo = describedVideo;

  q.ok(describedVideo.contains('http://media.w3.org/2010/05/sintel/trailer.mp4'),
       'we can ask whether it contains a source string');

  q.ok(describedVideo.contains(['http://media.w3.org/2010/05/sintel/trailer.mp4']),
       'we can ask whether it contains a sources list of strings');

  q.ok(describedVideo.contains([{
    src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
    type: 'video/mp4'
  }]), 'we can ask whether it contains a sources list of objects');

  q.ok(describedVideo.contains({
    sources: ['http://media.w3.org/2010/05/sintel/trailer.mp4']
  }), 'we can ask whether it contains a describedVideo item');

  q.ok(describedVideo.contains({
    sources: [{
      src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
      type: 'video/mp4'
    }]
  }), 'we can ask whether it contains a describedVideo item');

  q.ok(!describedVideo.contains('http://media.w3.org/2010/05/sintel/poster.png'),
       'we get false for a non-existent source string');

  q.ok(!describedVideo.contains(['http://media.w3.org/2010/05/sintel/poster.png']),
       'we get false for a non-existent source list of strings');

  q.ok(!describedVideo.contains([{
    src: 'http://media.w3.org/2010/05/sintel/poster.png',
    type: 'video/mp4'
  }]), 'we get false for a non-existent source list of objects');

  q.ok(!describedVideo.contains({
    sources: ['http://media.w3.org/2010/05/sintel/poster.png']
  }), 'we can ask whether it contains a describedVideo item');

  q.ok(!describedVideo.contains({
    sources: [{
      src: 'http://media.w3.org/2010/05/sintel/poster.png',
      type: 'video/mp4'
    }]
  }), 'we get false for a non-existent describedVideo item');
});

q.test('describedVideo.indexOf() works as expected', function() {
  var player = extend(true, {}, playerProxy);
  var describedVideo = describedVideoMaker(player, videoList);
  player.describedVideo = describedVideo;

  q.equal(describedVideo.indexOf('http://media.w3.org/2010/05/sintel/trailer.mp4'),
          0, 'sintel trailer is first item');

  q.equal(describedVideo.indexOf(['http://media.w3.org/2010/05/bunny/trailer.mp4']),
          1, 'bunny trailer is second item');

  q.equal(describedVideo.indexOf([{
    src: 'http://vjs.zencdn.net/v/oceans.mp4',
    type: 'video/mp4'
  }]), 2, 'oceans is third item');

  q.equal(describedVideo.indexOf({
    sources: ['http://media.w3.org/2010/05/bunny/movie.mp4']
  }), 3, 'bunny movie is fourth item');

  q.equal(describedVideo.indexOf({
    sources: [{
      src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
      type: 'video/mp4'
    }]
  }), 4, 'timer video is fifth item');

  q.equal(describedVideo.indexOf('http://media.w3.org/2010/05/sintel/poster.png'),
          -1, 'poster.png does not exist');

  q.equal(describedVideo.indexOf(['http://media.w3.org/2010/05/sintel/poster.png']),
          -1, 'poster.png does not exist');

  q.equal(describedVideo.indexOf([{
    src: 'http://media.w3.org/2010/05/sintel/poster.png',
    type: 'video/mp4'
  }]), -1, 'poster.png does not exist');

  q.equal(describedVideo.indexOf({
    sources: ['http://media.w3.org/2010/05/sintel/poster.png']
  }), -1, 'poster.png does not exist');

  q.equal(describedVideo.indexOf({
    sources: [{
      src: 'http://media.w3.org/2010/05/sintel/poster.png',
      type: 'video/mp4'
    }]
  }), -1, 'poster.png does not exist');
});

q.test('describedVideo.next() works as expected', function() {
  var player = extend(true, {}, playerProxy);
  var describedVideo = describedVideoMaker(player, videoList);
  var src;

  player.currentSrc = function() {
    return src;
  };

  src = videoList[0].sources[0].src;
  q.equal(describedVideo.currentItem(), 0, 'we start on item 0');
  q.deepEqual(describedVideo.next(), videoList[1], 'we get back the value of currentItem 2');
  src = videoList[1].sources[0].src;
  q.equal(describedVideo.currentItem(), 1, 'we are now on item 1');
  q.deepEqual(describedVideo.next(), videoList[2], 'we get back the value of currentItem 3');
  src = videoList[2].sources[0].src;
  q.equal(describedVideo.currentItem(), 2, 'we are now on item 2');
  src = videoList[4].sources[0].src;
  q.equal(describedVideo.currentItem(4), 4, 'we are now on item 4');
  q.equal(describedVideo.next(), undefined, 'we get nothing back if we try to go out of bounds');
});

q.test('describedVideo.previous() works as expected', function() {
  var player = extend(true, {}, playerProxy);
  var describedVideo = describedVideoMaker(player, videoList);
  var src;

  player.currentSrc = function() {
    return src;
  };

  src = videoList[0].sources[0].src;
  q.equal(describedVideo.currentItem(), 0, 'we start on item 0');
  q.equal(describedVideo.previous(), undefined, 'we get nothing back if we try to go out of bounds');

  src = videoList[2].sources[0].src;
  q.equal(describedVideo.currentItem(), 2, 'we are on item 2');
  q.deepEqual(describedVideo.previous(), videoList[1], 'we get back value of currentItem 1');

  src = videoList[1].sources[0].src;
  q.equal(describedVideo.currentItem(), 1, 'we are on item 1');
  q.deepEqual(describedVideo.previous(), videoList[0], 'we get back value of currentItem 0');
  src = videoList[0].sources[0].src;
  q.equal(describedVideo.currentItem(), 0, 'we are on item 0');
  q.equal(describedVideo.previous(), undefined, 'we get nothing back if we try to go out of bounds');
});

q.test('when loading a new describedVideo, trigger "describedVideochange" on the player', function() {
  var oldTimeout = window.setTimeout;
  var player = extend(true, {}, playerProxy);
  var describedVideo;

  window.setTimeout = function(fn, timeout) {
    fn();
  };

  player.trigger = function(type) {
    q.equal(type, 'describedVideochange', 'trigger describedVideochange on describedVideochange');
  };

  describedVideo = describedVideoMaker(player, [1,2,3]);

  describedVideo([4,5,6]);

  window.setTimeout = oldTimeout;
});

q.test('cleartimeout on dispose', function() {
  var oldTimeout = window.setTimeout;
  var oldClear = window.clearTimeout;
  var Player = function(proxy) {
    extend(true, this, proxy);
  };
  Player.prototype = Object.create(playerProxy);
  Player.prototype.constructor = Player;
  var describedVideo;
  var timeout = 1;

  window.setTimeout = function() {
    return timeout;
  };
  window.clearTimeout = function(to) {
    q.equal(to, timeout, 'we cleared the timeout');
  };

  player = new Player(videojs.EventEmitter.prototype);

  describedVideo = describedVideoMaker(player, [1,2,3]);

  describedVideo([1,2,3]);

  player.trigger('dispose');

  window.setTimeout = oldTimeout;
  window.clearTimeout = oldClear;
});
