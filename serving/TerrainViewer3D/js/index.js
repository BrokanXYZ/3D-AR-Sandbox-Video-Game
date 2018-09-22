// Socket stuff
var socket = io();

// List of player meshes
var players = [];

// Babylon vars
var canvas; 
var engine; 
var scene; 

//P1's vars
var camera;

// Terrain vars
var terrain;
var animationSteps = 150;
var numSubdiv = 150;
var stepCount = 0;
var currentPositions;
var numVerts;
var yDiff;
var yMax;



//Entry point
document.addEventListener("DOMContentLoaded", function() {
	initializeBabylon();
    createWorld();
	setupSpectator();
	setupSocketIO();
});
