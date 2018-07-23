var spectate = false;

//**List of players who are currently PLAYING the game**
//
// Active clients
//		0 = userID
//		1 = IP
//		2 = position
//		3 = color
//		4 = nickname
var activeClients;

// Socket stuff
var mySocketId = null;
var socket = io();

// List of player meshes
var players = [];

// Babylon vars
var canvas; 
var engine; 
var scene; 

//P1's vars
var camera;
var hpBar;
var playerSpeed = 1;
//		**		var attackSpeed = 1;
var spectatorCameraRotate;
var moveForward = false;
var moveBack = false;
var moveLeft = false;
var moveRight = false;
var actionDelay = false;
var player1IsDead = false;

var charMeshIsSetup = false;


// Delay times
var gotHitDelay = 750;
var gotBlockedDelay = 1500;

// No gravity on these! So, that player doesn't slide
var unevenMeshes = [];

// P1 Sounds
var block;
var gotHit;
var lavaDeath;
var swing;
var respawn;
var death;

// Respawn points
var respawnPoints = new Array();
respawnPoints[0] = new BABYLON.Vector3(43,3,-42);
respawnPoints[1] = new BABYLON.Vector3(-43,3,-39);
respawnPoints[2] = new BABYLON.Vector3(-46,3,40);
respawnPoints[3] = new BABYLON.Vector3(33,3,39);

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
	loadAudio();
    createWorld();
	setupSpectator();
	setupSocketIO();
});
