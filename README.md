# MMM-RTSPFrame - Capture frames from live feeds (security cameras) 

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).<br>
Inspired and partly based on [MMM-RTSPStream](https://github.com/shbatm/MMM-RTSPStream/).

This module will capture single frames from a RTSP video stream periodically and display it on the magic mirror.
In some cases it is enough to have a still image from a camera to know what is going on. A live stream from the camera is not always necessary.
For these cases, this simple, lightweight module can be usefull.

### Features:

* Supports capturing frames from a live RTSP video stream
* Stops capturing new frames when module is hidden to limit resource use on Raspberry Pi

### Dependencies:

* The following packages are required for the module to function fully:
    * `ffmpeg`
    
### Flow using `'ffmpeg'`:
Camera RTSP Stream → `ffmpeg` captures single frame and stores it in module's public directory → MM module's `node_helper.js` sends notification → `MagicMirror²` displays image

## Screenshot:

![](screenshot.png)

## Installation:

```shell
cd ~/MagicMirror/modules
git clone https://github.com/andreashebeisen/MMM-RTSPFrame
```

## Updating after a Module Update:

```shell
cd ~/MagicMirror/modules/MMM-RTSPFrame
git pull
```

## Using the module

**To use this module, use the configuration builder tool included.**

1. Install the module (see above).
2. Copy the config section below to your MagicMirror `config.js` file.
3. Change as needed.
3. Restart the MagicMirror.

## Configuration options

| Option              | Default    |Description
|-------------------- |----------- |-----------
| `debug`             | false      | boolean - Debug mode on or off. Show additional log messages for troubleshooting.
| `url`               | Sample URL | string - The URL of the RTSP stream.
| `animationSpeed`    | 1000       | number - The animation speed used to call `updateDom()` when a new frame has been captured.
| `frameRefreshDelay` | 10         | number - The delay in seconds before a new frame is captured after a frame has arrived. The actual time between two frames will be longer and depending on the performance of the call to `ffmpeg`.
| `protocol`          | udp        | string - Protocol to use for receiving RTSP stream<br>*Default:* `"tcp"`, valid options: `"tcp"` or `"udp"`.
| `width`             | 900        | number - The width in px of the frame displayed on the mirror (does not affect the size of the actual frame captured by ffmpeg).
| `height`            | 506        | number - The height in px of the frame displayed on the mirror (does not affect the size of the actual frame captured by ffmpeg).

### Sample config

```js
{
    module: "MMM-RTSPFrame",
    position: "middle_center",
    header: "Camera 1",
    config: {
        debug: false,
        url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4',
        animationSpeed: 200,
        frameRefreshDelay: 10, // Seconds
        protocol: "tcp", // 'tcp' or 'udp'
        width: 900,
        height: 506
    }
}
```

## Testing a camera feed

To test to make sure you have a working url for a camera feed: Copy the URL and open it with a video player like [VLC](https://www.videolan.org/vlc/#download).

## Tested cameras

This module has been tested exclusively with streams for `Ezviz (C6N)` cameras. Please let me know if you have a working copy of this module using another type of camera or there are necessary changes to the module.
