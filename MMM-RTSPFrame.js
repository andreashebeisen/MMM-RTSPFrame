/* global Module */

/* Magic Mirror
 * Module: MMM-RTSPFrame
 *
 * By andreashebeisen
 * MIT Licensed.
 */
/* jshint esversion: 6*/
var global = this;

Module.register("MMM-RTSPFrame", {
    defaults: {
        debug: false,
        url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4',
        animationSpeed: 1000,
        frameRefreshDelay: 10, // seconds
        protocol: "tcp", // 'tcp' or 'udp'
        width: 900,
        height: 506
    },

    requiresVersion: "2.4.0", // Required version of MagicMirror

    // Allow for control on muliple instances
    instance: (global.location && ["localhost", "127.0.0.1", "::1", "::ffff:127.0.0.1", undefined, "0.0.0.0"].indexOf(global.location.hostname) > -1) ? "SERVER" : "LOCAL",

    start: function() {
        // Flag for check if module is loaded
        this.loaded = false;

        if (!this.config.initialSetup) {
            this.sendSocketNotification('CONFIG', this.config);
        }
    },

    /* suspend()
     * This method is called when a module is hidden.
     */
    suspend: function() {
        console.log(`${this.name} is suspended...`);
        this.suspended = true;
    },

    /* resume()
     * This method is called when a module is shown.
     */
    resume: function() {
        console.log(`${this.name} is resumed...`);
        this.suspended = false;
        this.updateFrame();
    },

    updateFrame: function() {
        this.config.debug && console.log(`${this.name} - Send socket notification 'CAPTURE_FRAME'...`);
        this.sendSocketNotification("CAPTURE_FRAME");
    },

    getDom: function() {
        // create element wrapper for show into the module
        let wrapper = document.createElement("div");
        wrapper.id = "MMM-RTSPFrame";

        if (!this.loaded) {
            wrapper.innerHTML = "Loading " + this.name + "...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        if (this.error) {
            wrapper.innerHTML = "Error loading data...";
            return wrapper;
        }

        if (this.loaded) {
            wrapper.className = "MMM-RTSPFrame wrapper";
            wrapper.innerHTML = `<img src="/MMM-RTSPFrame/frame.jpg?t=${new Date().getTime()}" width="${this.config.width}" height="${this.config.height}" />`;
        }

        return wrapper;
    },

    // socketNotificationReceived from helper
    socketNotificationReceived: function(notification, payload) {
        if (notification === "STARTED") {
            if (!this.loaded) {
                this.loaded = true;
                this.updateDom(this.config.animationSpeed);
                if (!this.suspended) {
                    this.updateFrame();
                }
            }
        }
        if (notification === "NEW_FRAME") {
            this.config.debug && console.log(`${this.name} - Socket notification 'NEW_FRAME' received...`);
            this.updateDom(this.config.animationSpeed);

            if (!this.suspended) {
                setTimeout(() => this.updateFrame(), this.config.frameRefreshDelay * 1000);
            }
        }
    },
});
