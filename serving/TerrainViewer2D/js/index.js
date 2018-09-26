// Socket stuff
var socket = io();

// Babylon vars
var canvas; 
var engine; 
var scene; 

//P1's vars
var camera;

//GUI vars
var advancedTexture;
var hMap;
var contours;

//Entry point
document.addEventListener("DOMContentLoaded", function() {
	initializeBabylon();
    setupGUI();
	setupCamera();
	setupSocketIO();
});
