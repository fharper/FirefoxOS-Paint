/*jslint browser:true */

(function() {
    "use strict";
    var lastOrientation = null;
    var drawings = new Array(0);

    //Creating an draw object
    function Draw(drawType, fillStyle, x, y, radius) {
        this.drawType = drawType;
        this.fillStyle = fillStyle;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    //Draw on the canvas
    function drawOnCanvas(evt) {
        evt.preventDefault();

        var canvas = document.querySelector("#canvas");
        var rect = canvas.getBoundingClientRect();
        var context = canvas.getContext("2d");

        context.fillStyle = 'black';


        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            context.beginPath();
            context.arc(touches[i].pageX, touches[i].pageY, 5, 0, Math.PI * 2);
            context.closePath();
            context.fill();

            drawings.push(new Draw('arc', 'black', touches[i].pageX, touches[i].pageY, 5));
        }
    }

    //Start the drawing on the canvas
    function startDrawOnCanvas() {
        var canvas = document.querySelector("#canvas");
        canvas.style.cursor = "pointer";
        canvas.addEventListener("touchmove", drawOnCanvas);
    }

    //Stop the drawing on the canvas
    function stopDrawOnCanvas() {
        var canvas = document.querySelector("#canvas");
        canvas.style.cursor = "default";
        canvas.removeEventListener("touchmove", drawOnCanvas);
    }

    //All stuff we need to do to resize the canvas, and after the resizing
    function resizeCanvas() {
        var orientation = screen.mozOrientation;
        var canvas = document.querySelector("#canvas");
        var context = canvas.getContext("2d");

        //Need to set the canvas size here, as it zoom with CSS
        var newWidth = null;
        var newHeight = null;

        if (orientation == "portrait-primary" || orientation == "portrait-secondary") {
            newWidth = canvas.width = window.innerWidth;
            newHeight = canvas.height = window.innerHeight - document.querySelector("div[role='toolbar']").offsetHeight;
        }
        else {
            newWidth = canvas.width = window.innerWidth - document.querySelector("div[role='toolbar']").offsetWidth;
            newHeight = canvas.height = window.innerHeight;
        }

        //If the orientation has changed, redraw
        if (lastOrientation != null) {
            for (var i = 0; i < drawings.length; i++) {

                if ((lastOrientation === "portrait-primary" && orientation == "landscape-primary") || (lastOrientation === "portrait-secondary" && orientation == "landscape-secondary")
                        || (lastOrientation === "landscape-secondary" && orientation == "portrait-primary") || (lastOrientation === "landscape-primary" && orientation == "portrait-secondary")) {
                    var oldX = drawings[i].x;
                    drawings[i].x = newWidth - drawings[i].y;
                    drawings[i].y = oldX;
                }
                else if ((lastOrientation === "portrait-primary" && orientation == "portrait-secondary") || (lastOrientation === "portrait-secondary" && orientation == "portrait-primary")
                        || (lastOrientation === "landscape-primary" && orientation == "landscape-secondary") || (lastOrientation === "landscape-secondary" && orientation == "landscape-primary")) {
                    drawings[i].x = newWidth - drawings[i].x;
                    drawings[i].y = newHeight - drawings[i].y;   
                }

                else if((lastOrientation === "portrait-secondary" && orientation == "landscape-primary") || (lastOrientation === "portrait-primary" && orientation == "landscape-secondary")
                        || (lastOrientation === "landscape-primary" && orientation == "portrait-primary") || (lastOrientation === "landscape-secondary" && orientation == "portrait-secondary") ) {
                    var oldX = drawings[i].x;
                    drawings[i].x = drawings[i].y;
                    drawings[i].y = newHeight - oldX;   
                }

                if (drawings[i].drawType === "arc") {
                    context.beginPath();
                    context.fillStyle = drawings[i].fillStyle;
                    context.arc(drawings[i].x, drawings[i].y, drawings[i].radius, 0, Math.PI * 2);
                    context.closePath();
                    context.fill();
                }
            }
        }
            
        lastOrientation = orientation;
    }

    //Add the events at the loading of the page
    window.onload = function() {
        //When orientation of the screen change
        window.screen.onmozorientationchange = resizeCanvas;

        //Listener to draw on the canvas
        var canvas = document.querySelector("#canvas");
        canvas.addEventListener("touchstart", startDrawOnCanvas);
        canvas.addEventListener("touchend", stopDrawOnCanvas);

       resizeCanvas();
    };

})();