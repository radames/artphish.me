(function() {

  'use strict';

  // Our element ids.
  var options = {
    video: '#video',
    canvas: '#canvas',
  };

  // Our object _this will hold all of the functions.
  var App = {
    // Get the video element.
    video: document.querySelector(options.video),
    // Get the canvas element.
    canvas: document.querySelector(options.canvas),
    // Get the canvas context.
    ctx: canvas.getContext('2d'),
    // Get the capture button.
    // This will hold the video stream.
    localMediaStream: null,
    // This will hold the screenshot base 64 data url.
    dataURL: null,
    // This will hold the converted PNG url.
    imageURL: null,
    // Get the input field to paste in the imageURL.

    initialize: function() {
      var _this = this;
      // Check if navigator object contains getUserMedia object.
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      // Check if window contains URL object.
      window.URL = window.URL || window.webkitURL;

      // Check for getUserMedia support.
      if (navigator.getUserMedia) {
        // Get video stream.
        navigator.getUserMedia({
          video:{ mandatory: {
	      maxWidth: 320,
	      maxHeight: 180
	   }
	}
        }, _this.gotStream, _this.noStream);

	setTimeout(function(){
         _this.capture();
       	}, 2000);
      } else {
        // No getUserMedia support.
        alert('Your browser does not support getUserMedia API.');
      }
    },

    // Stream error.
    noStream: function (err) {
      alert('Could not get camera stream.');
      console.log('Error: ', err);
    },

    // Stream success.
    gotStream: function (stream) {
      // Feed webcam stream to video element.
      // IMPORTANT: video element needs autoplay attribute or it will be frozen at first frame.
      if (window.URL) {
        video.src = window.URL.createObjectURL(stream);
      } else {
        video.src = stream; // Opera support.
      }

      // Store the stream.
      App.localMediaStream = stream;
    },

    // Capture frame from live video stream.
    capture: function () {
      var _this = this;
      console.log("capture");
      // Check if has stream.
      if (_this.localMediaStream) {
        // Draw whatever is in the video element on to the canvas.
        _this.ctx.drawImage(video, 0, 0);
        // Create a data url from the canvas image.
        _this.dataURL = canvas.toDataURL('image/png');
        // Call our method to save the data url to an image.
        _this.saveDataUrlToImage();
      }
    },

    saveDataUrlToImage: function () {
      var _this = this;
      var options = {
        // Change this to your own url.
          url: 'http://localhost:7823'
      };

      // Make an ajax request to our server to convert the dataURL to a PNG image,
      // and return the url of the converted image.

      var data = _this.dataURL;

      var request = new XMLHttpRequest();
      request.open('POST', options.url, true);

      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
      request.onload = function() {
        var response = JSON.parse(request.responseText);
        console.log('Response: ', request);

        if (request.status >= 200 && request.status < 400) {
          console.log("SUCCESS");
 	  window.location.replace("http://localhost:8000/camera.html");
	  // Success!
          // Paste the PNG image url into the input field.
        } else {
          console.log("ERROR");
	  // Some error occured.
        }
      };

      request.onerror = function() {
        // There was a connection error of some sort
      };

      request.send(_this.dataURL);
    }

  };

  // Initialize our application.
  App.initialize();

  // Expose to window object for testing purposes.
  window.App = App || {};

})();

