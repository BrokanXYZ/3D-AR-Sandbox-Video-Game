// Socket stuff
var socket = io();

// Babylon vars
var canvas; 
var engine; 
var scene; 

// P1's vars
var camera;

// GUI vars
var advancedTexture;
var hMap;
var contours;
var players = [];
var playerNodes = new Map();
var pNodeSize = 35;

// 2D & 3D Map Ranges
var xMin3D = -750;
var zMin3D = -562.5;
var xMin2D = -943;
var zMin2D = 523;
var xMax3D = 750;
var zMax3D = 562.5;
var xMax2D = 943;
var zMax2D = -523;
var xRange3D = xMax3D - xMin3D;
var zRange3D = zMax3D - zMin3D;
var xRange2D = xMax2D - xMin2D;
var zRange2D = zMax2D - zMin2D;


// Entry point
document.addEventListener("DOMContentLoaded", function() {
	initializeBabylon();
    setupGUI();
	setupCamera();
	setupSocketIO();
});
