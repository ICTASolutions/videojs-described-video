[![Build Status](https://travis-ci.org/ICTASolutions/videojs-described-video.svg?branch=master)](https://travis-ci.org/ICTASolutions/videojs-described-video)
# Described Video plugin for videojs

## Usage

```js
require('videojs-described-video');

var player = videojs('video');
player.describedVideo([{
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
}]);

player.describedVideo.described();
```

## API

* [Methods](#methods)
  * [`player.describedVideo([Array newPlaylist])`](#playerplaylistarray-newplaylist---array)
  * [`player.describedVideo.currentItem([Number newIndex])`](#playerdescribedvideocurrentitemnumber-newindex---number)
  * [`player.describedVideo.contains(Any item)`](#playerdescribedvideocontainsany-item---boolean)
  * [`player.describedVideo.indexOf(Any item)`](#playerdescribedvideoindexofany-item---number)
  * [`player.describedVideo.described()`](#playerdescribedvideodescribed---object)
  * [`player.describedVideo.original()`](#playerdescribedvideooriginal---object)
  * [`player.describedVideo.toggle()`](#playerdescribedvideotoggle---object)
* [Events](#events)
  * [`describedvideochange`](#describedvideochange)

### Methods
#### `player.describedVideo([Array newPlaylist]) -> Array`
This function allows you to either set or get the current playlist.
If called without arguments, it is a getter, with an argument, it is a setter.

```js
player.describedVideo();
// [{
//   sources: [{
//     src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
//     type: 'video/mp4'
//   }],
//   poster: 'http://media.w3.org/2010/05/sintel/poster.png'
// }, {
//   sources: [{
//     src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
//     type: 'video/mp4'
//   }],
// ...

player.describedVideo([{
  sources: [{
    src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
    type: 'video/mp4'
  }],
  poster: 'http://media.w3.org/2010/05/video/poster.png'
}]);
// [{
//   sources: [{
//     src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
//     type: 'video/mp4'
//   }],
//   poster: 'http://media.w3.org/2010/05/video/poster.png'
// }]
```

#### `player.describedVideo.currentItem([Number newIndex]) -> Number`
This functions allows you to either set or get the current item index.
If called without arguments, it is a getter, with an argument, it is a setter.

If the player is currently playing a non-playlist video, `currentItem` will return `-1`.

```js
player.currentItem();
// 0

player.currentItem(2);
// 2
```

```js
player.describedVideo(samplePlaylist);
player.src('http://example.com/video.mp4');
player.playlist.currentItem(); // -1
```

#### `player.describedVideo.contains(Any item) -> Boolean`
This function allows you to ask the describedVideo whether a string, source object, or playlist item is contained within it.
Assuming the above playlist, consider the following example:

```js
describedVideo.contains('http://media.w3.org/2010/05/sintel/trailer.mp4')
// true

describedVideo.contains([{
  src: 'http://media.w3.org/2010/05/sintel/poster.png',
  type: 'image/png'
}])
// false

describedVideo.contains({
  sources: [{
    src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
    type: 'video/mp4'
  }]
});
// true
```

#### `player.describedVideo.indexOf(Any item) -> Number`
This function allows you to ask the describedVideo whether a string, source object, or playlist item is contained within it and at what index. It returns `-1` for non-existent items, otherwise, the corresponding index.
Assuming the above playlist, consider the following example:

```js
describedVideo.indexOf('http://media.w3.org/2010/05/bunny/trailer.mp4')
// 1

describedVideo.contains([{
  src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
  type: 'video/mp4'
}])
// 3

describedVideo.contains({
  sources: [{
    src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
    type: 'video/mp4'
  }]
});
// 4
```

#### `player.describedVideo.described() -> Object`
This functions allows you to switch to the described item in the playlist. You will receive the new playlist item back from this call. `player.describedVideo.currentItem` will be updated to return the new index.
If you are already at the described item of the playlist, you will not be able to proceed past the end and instead will not receive anything back;

```js
player.describedVideo.described();
// {
//   sources: [{
//     src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
//     type: 'video/mp4'
//   }],
//   poster: 'http://media.w3.org/2010/05/bunny/poster.png'
// }
```

#### `player.describedVideo.original() -> Object`
This functions allows you to switch to the original item in the playlist. You will receive the new playlist item back from this call. `player.describedVideo.currentItem` will be updated to return the new index.
If you are already at the original item of the playlist, you will not be able to proceed past the start and instead will not receive anything back;

```js
player.describedVideo.original();
// {
//   sources: [{
//     src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
//     type: 'video/mp4'
//   }],
//   poster: 'http://media.w3.org/2010/05/sintel/poster.png'
// }
```

### Events

#### `describedvideochange`
This event is fired asynchronously whenever the current video is changed.

```js
player.on('describedvideochange', function() {
  console.log(player.describedVideo());
});

player.describedVideo.described();
//

player.describedVideo.original();
//
```

## Development

### npm scripts
* `npm run build` - Build `dist/bundle.js` file only. Alias for `build-dist`
* `npm run watch` - Watch and rebuild `dist/bundle.js` and `dist/tests.js` files as necessary
* `npm run buildall` - Build both `dist/bundle.js` and `dist/tests.js`
* `npm run build-dist` - Build only `dist/bundle.js`
* `npm run watch-dist` - watch and rebuild `dist/bundle.js` file as necessary
* `npm run build-tests` - Build only `dist/tests.js`
* `npm run watch-tests` - watch and rebuild `dist/tests.js` file as necessary
* `npm test` - Run jshint on all javascript files, build `dist/tests.js` file, and do a single run of karma
* `npm run test-watch` - Watch and rebuild `dist/tests.js` file as necessary and run karma watch to re-run tests as necessary
* `npm run jshint` - Just run jshint on all files

### Building
You should either include this project directly in your browserify or you can build it by running
`npm run build`

### Running tests
You can run a single test run, which includes running jshint as well as karma by running
```sh
npm test
```
For development, consider running
```sh
npm run test-watch
```
Which will re-run the karma tests as you save your files to let you know your test results automatically.

## Acknowledgement

This plugin is based on the [playlist plugin](https://github.com/brightcove/videojs-playlist) from Brighcove.

## [LICENSE](https://github.com/ICTASolutions/videojs-described-video/blob/master/LICENSE.md)
