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

// Animation ranges
var idleS = 471;
var idleE = 670;
var runS = 301;
var runE = 360;
var lAttackS = 101;
var lAttackE = 175;
var rAttackS = 201;
var rAttackE = 275;
var uAttackS = 371;
var uAttackE = 445;
var dAttackS = 0;
var dAttackE = 75;
var lBlockS = 181;
var lBlockE = 193;
var rBlockS = 281;
var rBlockE = 293;
var uBlockS = 451;
var uBlockE = 463;
var dBlockS = 81;
var dBlockE = 93;

//Entry point
document.addEventListener("DOMContentLoaded", function() {
	initializeBabylon();
    createWorld();
	setupSocketIO();
});
