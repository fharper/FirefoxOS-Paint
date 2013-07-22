/*jslint browser:true */

(function() {
    "use strict";

    //Draw on the canvas
    function drawOnCanvas(evt) {
        evt.preventDefault();

        var canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        var context = canvas.getContext("2d");

        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            context.beginPath();
            context.arc(touches[i].pageX, touches[i].pageY, 5, 0, Math.PI * 2);
            context.closePath();
            context.fill();
        }
    }

    //Start the drawing on the canvas
    function startDrawOnCanvas() {
        var canvas = document.getElementById("canvas");
        canvas.style.cursor = "pointer";
        canvas.addEventListener("touchmove", drawOnCanvas);
    }

    //Stop the drawing on the canvas
    function stopDrawOnCanvas() {
        var canvas = document.getElementById("canvas");
        canvas.style.cursor = "default";
        canvas.removeEventListener("touchmove", drawOnCanvas);
    }

    //Add the events at the loading of the page
    window.onload = function() {
        document.getElementById("canvas").addEventListener("touchstart", startDrawOnCanvas);
        document.getElementById("canvas").addEventListener("touchend", stopDrawOnCanvas);

        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
})();