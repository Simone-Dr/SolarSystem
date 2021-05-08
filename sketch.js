let planet = []; 
let sun; 
const planetSizeFactor = 1000;
const EarthRToAU = 0.000042588;		// 1 AU =	 149 597 870, 7 km
									// 1 EarthRadius = 6 371 km
									// Radius in EarthRadius to AU : 1 EarthRadius = 0.000042588 AU  

function setup() {
	createCanvas(windowWidth, windowHeight);

	let AuToScreen = windowWidth / 2 / 40 ;  //40 AU = windowwith/2
						
	sun 	  = new Body(109  * EarthRToAU * AuToScreen, createVector(0), 	createVector(0,0), '#f9be27'); 
	let radSun = 109 * EarthRToAU * AuToScreen * planetSizeFactor; 	 
				//	radius relative to earth is translated to AU ; Distance to sun in AU (sun surface)								Mass (1024kg)	
	planet[0] = new Body(0.4  * EarthRToAU * AuToScreen, createVector(0.387 * AuToScreen + radSun, 0),  createVector(0, 0), '#c9c8c7', 0.330); 
	planet[1] = new Body(0.9  * EarthRToAU * AuToScreen, createVector(0.722 * AuToScreen + radSun, 0),  createVector(0, 0), '#f2d79e', 4.87); 
	planet[2] = new Body(1 	  * EarthRToAU * AuToScreen, createVector(1 	* AuToScreen + radSun, 0),	createVector(0, 0), '#45ceb3', 5.97); 
	planet[3] = new Body(0.5  * EarthRToAU * AuToScreen, createVector(1.52  * AuToScreen + radSun, 0), 	createVector(0, 0), '#c65836', 0.642); 
	planet[4] = new Body(11.2 * EarthRToAU * AuToScreen, createVector(5.2 	* AuToScreen + radSun, 0), 	createVector(0, 0), '#a27f5d', 1898); 
	planet[5] = new Body(9.4  * EarthRToAU * AuToScreen, createVector(9.58 	* AuToScreen + radSun, 0), 	createVector(0, 0), '#eac757', 568); 
	planet[6] = new Body(4    * EarthRToAU * AuToScreen, createVector(19.2	* AuToScreen + radSun, 0), 	createVector(0, 0), '#99c3c4', 86.8); 
	planet[7] = new Body(3.9  * EarthRToAU * AuToScreen, createVector(30.1 	* AuToScreen + radSun, 0), 	createVector(0, 0), '#527fdb', 102); 

}

function draw() {
	background(40, 40, 40);
	translate(width/2, height/2);
	
  	scale(zoom);

  	sun.show(); 


	for (let i = 0; i < planet.length; i++) {
		//planet[i].update();
		planet[i].show();
	}
}



function Body(_radius, _pos, _vel, _tex, _mass) {
	this.radius = _radius * planetSizeFactor; 
 	this.pos= _pos;
	this.vel = _vel;
	this.tex = _tex; 
	this.mass = _mass;

	this.show = function(){
		noStroke(); 		
		fill(this.tex); 
		ellipse(this.pos.x , this.pos.y, this.radius * 2); 
	}

	/* this.update = function(){
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
	}


	this.attract = function(){

	}*/
	
}

var zoom = 1.00;
var zMin = 0.1;
var zMax = 1000;
var sensativity = 0.005;

 
function mouseWheel(event) {
  zoom -= sensativity * event.delta;
  zoom = constrain(zoom, zMin, zMax);
  return false;
}


