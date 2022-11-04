/* Magic Mirror
 * Node Helper: MMM-RTSPFrame
 *
 * By andreashebeisen
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
const { exec } = require('child_process');

module.exports = NodeHelper.create({
    config: {},

    start: function () {
        console.log("Starting MMM-RTSPFrame...");
    },

    stop: function () {
        console.log("Shutting down MMM-RTSPFrame...");
    },

    // Override socketNotificationReceived method.

    /* socketNotificationReceived(notification, payload)
     * This method is called when a socket notification arrives.
     *
     * argument notification string - The identifier of the noitication.
     * argument payload mixed - The payload of the notification.
     */
    socketNotificationReceived: function (notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
            this.sendSocketNotification("STARTED");
        }
        if (notification === "CAPTURE_FRAME") {
            this.captureFrame();
        }
    },

    captureFrame: function () {        
        let command = `ffmpeg -y -i ${this.config.url}${this.config.protocol === "tcp" ? " -rtsp_transport tcp" : "" } -frames:v 1 ${this.path}\\public\\frame.jpg`;
        this.config.debug && console.log(`${this.name} - Execute: ${command}`);
        exec(command, (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command                
                console.error(`error: ${err}`);
                return;
            }

            // the *entire* stdout and stderr (buffered)
            this.config.debug && console.log(`stdout: ${stdout}`);
            this.config.debug && console.log(`stderr: ${stderr}`);

            this.sendSocketNotification("NEW_FRAME");
        });
    }
});
