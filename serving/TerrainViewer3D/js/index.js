// Socket stuff
var socket = io();

// Babylon vars
var canvas; 
var engine; 
var scene; 

//P1's vars
var camera;

// Terrain vars
var terrain;
var currentPositions;
var numVerts;
var yDiff;
var yMax;

var animationSteps = 200;
var stepCount = 0;

var terrainSize = 1;
var numSubdiv = 150;



//Entry point
document.addEventListener("DOMContentLoaded", function() {
	initializeBabylon();
    createWorld();
	setupSpectator();
	setupSocketIO();
});
