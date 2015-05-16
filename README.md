[![Build Status](https://travis-ci.org/brightcove/videojs-playlist.svg?branch=master)](https://travis-ci.org/brightcove/videojs-playlist)

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
  * [`player.describedVideo.currentItem([Number newIndex])`](#playerplaylistcurrentitemnumber-newindex---number)
  * [`player.describedVideo.contains(Any item)`](#playerplaylistcontainsany-item---boolean)
  * [`player.describedVideo.indexOf(Any item)`](#playerplaylistindexofany-item---number)
  * [`player.describedVideo.next()`](#playerplaylistnext---object)
  * [`player.describedVideo.previous()`](#playerplaylistprevious---object)
  * [`player.describedVideo.described()`](#playerplaylistdescribed---object)
  * [`player.describedVideo.original()`](#playerplaylistoriginal---object)
* [Events](#events)
  * [`playlistchange`](#playlistchange)

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

#### `player.playlist.currentItem([Number newIndex]) -> Number`
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

#### `player.playlist.contains(Any item) -> Boolean`
This function allows you to ask the playlist whether a string, source object, or playlist item is contained within it.
Assuming the above playlist, consider the following example:

```js
playlist.contains('http://media.w3.org/2010/05/sintel/trailer.mp4')
// true

playlist.contains([{
  src: 'http://media.w3.org/2010/05/sintel/poster.png',
  type: 'image/png'
}])
// false

playlist.contains({
  sources: [{
    src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
    type: 'video/mp4'
  }]
});
// true
```

#### `player.playlist.indexOf(Any item) -> Number`
This function allows you to ask the playlist whether a string, source object, or playlist item is contained within it and at what index. It returns `-1` for non-existent items, otherwise, the corresponding index.
Assuming the above playlist, consider the following example:

```js
playlist.indexOf('http://media.w3.org/2010/05/bunny/trailer.mp4')
// 1

playlist.contains([{
  src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
  type: 'video/mp4'
}])
// 3

playlist.contains({
  sources: [{
    src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
    type: 'video/mp4'
  }]
});
// 4
```

#### `player.playlist.next() -> Object`
This functions allows you to advance to the next item in the playlist. You will receive the new playlist item back from this call. `player.playlist.currentItem` will be updated to return the new index.
If you are at the end of the playlist, you will not be able to proceed past the end and instead will not receive anything back;

```js
player.playlist.next();
// {
//   sources: [{
//     src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
//     type: 'video/mp4'
//   }],
//   poster: 'http://media.w3.org/2010/05/bunny/poster.png'
// }


player.playlist.currenItem(player.describedVideo().length - 1); // set to last item
// 4
player.playlist.next();
// undefined
```

#### `player.playlist.previous() -> Object`
This functions allows you to return to the previous item in the playlist. You will receive the new playlist item back from this call. `player.playlist.currentItem` will be updated to return the new index.
If you are at the start of the playlist, you will not be able to proceed past the start and instead will not receive anything back;

```js
player.playlist.currenItem(1); // set to second item in the playlist
// 1
player.playlist.previous();
// {
//   sources: [{
//     src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
//     type: 'video/mp4'
//   }],
//   poster: 'http://media.w3.org/2010/05/sintel/poster.png'
// }


player.playlist.currenItem();
// 0
player.playlist.previous();
// undefined
```

#### `player.playlist.described() -> Object`
This functions allows you to switch to the described item in the playlist. You will receive the new playlist item back from this call. `player.playlist.currentItem` will be updated to return the new index.
If you are already at the described item of the playlist, you will not be able to proceed past the end and instead will not receive anything back;

```js
player.playlist.next();
// {
//   sources: [{
//     src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
//     type: 'video/mp4'
//   }],
//   poster: 'http://media.w3.org/2010/05/bunny/poster.png'
// }


player.playlist.currenItem(player.describedVideo().length - 1); // set to last item
// 4
player.playlist.next();
// undefined
```

#### `player.playlist.original() -> Object`
This functions allows you to switch to the original item in the playlist. You will receive the new playlist item back from this call. `player.playlist.currentItem` will be updated to return the new index.
If you are already at the original item of the playlist, you will not be able to proceed past the start and instead will not receive anything back;

```js
player.playlist.currenItem(1); // set to second item in the playlist
// 1
player.playlist.previous();
// {
//   sources: [{
//     src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
//     type: 'video/mp4'
//   }],
//   poster: 'http://media.w3.org/2010/05/sintel/poster.png'
// }


player.playlist.currenItem();
// 0
player.playlist.previous();
// undefined
```

### Events

#### `playlistchange`
This event is fired asynchronously whenever the playlist is changed.
It is fired asynchronously to let the browser start loading the first video in the new playlist.

```js
player.on('playlistchange', function() {
  console.log(player.describedVideo());
});

player.describedVideo([1,2,3]);
// [1,2,3]

player.describedVideo([4,5,6]);
// [4,5,6]
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
