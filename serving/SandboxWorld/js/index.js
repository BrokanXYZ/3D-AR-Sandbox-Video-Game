var spectate = false;
var spectateSpeed = 50;


// Socket stuff
var socket = io();

// Babylon vars
var canvas; 
var engine; 
var scene; 

// Other players
var players = new Map();
var activeClients = [];

//P1's vars
var playerSpeed = 1;
var camera;
var mySocketId;
var moveForward = false;
var moveBack = false;
var moveLeft = false;
var moveRight = false;

// Terrain vars
var unevenMeshes = [];
var terrain;
var currentPositions;
var numVerts;
var yDiff;
var yMax;
var animationSteps = 200;
var stepCount = 0;
var terrainSize = 1.5;
var numSubdiv = 150;

//Entry point
document.addEventListener("DOMContentLoaded", function() {
	initializeBabylon();
    createWorld();
	setupSocketIO();
});
