var planet = []; 
var sun; 
var pausePlay = false; 		//false = pause
var hiddenSun = false; 		//false = Sun shows
var hiddenNames = false; 	//false = name shows
var zoom = 1;
var AuToScreen;		
var planetSizeFactor = 1;
var canvas;

									
var time = {
	current: null, 
	day: null,		
	month: null,
	year: null,
	julianDate: null,
	transDate: null,
	startingDate: new Date() //Set today as the day to display
}

function setup() {
	noLoop();
	frameRate(30); 		
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);
	canvas.style('z-index', '-1');
	AuToScreen = windowHeight / 2 / 2; // 2 Astronomic units make up half of the window
	PlanetInit(); //Initiate Planets
	time.current = time.startingDate;
	dateToTransDate(); //Transforms the normal Gregorian Date to Julien Centuries since 2000
	drawOrbit(); 
	textFont('Abel');
	loop(); //start drawfunction

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//dates---------------------------------

function dateToTransDate(){	
	time.day = time.current.getDate();
	time.month = time.current.getMonth() + 1 ; // date counts January as 0
	time.year = time.current.getFullYear();
	time.julianDate = getJulianDate(time.year, time.month, time.day);
	time.transDate = (time.julianDate - 2451545) / 36525; 

}		//time measured in Julian centuries (36525 days) from the epoch 2000 January 


function changeDate(date) {
	time.current = new Date(Date.parse(date));
	console.log (time.current);
	dateToTransDate();
}

function increaseDate(inc){
	time.current = new Date(time.current.getFullYear(), time.current.getMonth(), time.current.getDate() + inc);
	dateToTransDate()
}

function getJulianDate(year, month, day){ //http://www.braeunig.us/space/plntpos.htm#julian
	let inputDate = new Date(year,month,Math.floor(day));
	let StartGregorian = new Date("1582","10","15");
	
	if (month == 1 || month == 2){ //Adjust for Jan and Feb
		year = year - 1;
		month = month + 12;
	}

	let B = 0;

	if (inputDate >= StartGregorian){ //if date is in the Gregorian calendar
		let A = Math.floor(year / 100); 
		B = 2 - A + Math.floor(A / 4); 
	}
					
	return ((Math.floor(365.25 * year)) + (Math.floor(30.6001 * (month + 1))) + day + 1720994.5 + B);			
}

//----

function PlanetInit() {
	let img = [];
	
	//pictures from https://solarsystem.nasa.gov/planets/overview/
	img[0] = loadImage('pictures/sun.jpg');
	img[1] = loadImage('pictures/mercury.jpg')		 	 		 	 	 	 	
	img[2] = loadImage('pictures/venus.png')
	img[3] = loadImage('pictures/earth.jpg')
	img[4] = loadImage('pictures/mars.jpg')
	img[5] = loadImage('pictures/jupiter.jpg')
	img[6] = loadImage('pictures/saturn.jpg')
	img[7] = loadImage('pictures/uranus.jpg')
	img[8] = loadImage('pictures/neptune.jpg')


	let EarthRToAU = 0.000042588; //Radius in EarthRadius to AU : 1 EarthRadius = 0.000042588 AU 	

	//keplerian elements from https://ssd.jpl.nasa.gov/?planet_pos
	sun  	 = new Body("Sun", 	109  * EarthRToAU, '#f9be27', img[0], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); 
	 													 //		  									 		 						  a =			e =	    	i =  Orbit  L = mean	lonigtude of  longitude of  		rates at which Elements change 
	// planets radius relative to earth is translated to AuToScreen 	  									    in days		Gravity	  Orbitsize 	eccentricity Inclination Longitude 	perihelon (w) ascending node (o) ---------------------------->
	//					 name, 		_radius, 				_tex, 	  img, moons, type, 			  mass, lengthOfYear,..Day
	planet[0] = new Body("Mercury", 0.38294 * EarthRToAU , '#c9c8c7', img[1], 0, "Terrestrial planet", 0.330, 88.0, 58.6462,  	3.7,  0.38709927,	0.20563593,	7.00497902,	252.25032350, 77.45779628,	48.33076593, 0.00000037, 0.00001906, -0.00594749, 149472.67411175, 	0.16047689,	-0.1253408); 
	planet[1] = new Body("Venus", 	0.9499 	* EarthRToAU , '#f2d79e', img[2], 0, "Terrestrial planet", 4.87,  224.7, -243.018,  8.9,  0.72333566,	0.00677672,	3.39467605,	181.97909950, 131.60246718,	76.67984255, 0.00000390, -0.00004107,-0.00078890, 58517.81538729,  	0.00268329,	-0.27769418);
	planet[2] = new Body("Earth", 	1 	 	* EarthRToAU , '#45ceb3', img[3], 1, "Terrestrial planet", 5.97,  365.2, 0.99726968,9.8,  1.00000261,	0.01671123,	-0.00001531,100.46457166, 102.93768193,	0.0,		 0.00000562, -0.00004392,-0.01294668, 35999.37244981,  	0.32327364,	0.0);
	planet[3] = new Body("Mars", 	0.53202 * EarthRToAU , '#e5903f', img[4], 2, "Terrestrial planet", 0.642, 687.0, 1.02595676,3.7,  1.52371034,	0.09339410,	1.84969142,	-4.55343205,  -23.94362959,	49.55953891, 0.00001847, 0.00007882, -0.00813131, 19140.30268499,  	0.44441088,	-0.29257343);
	planet[4] = new Body("Jupiter",	10.97332* EarthRToAU , '#c2ad90', img[5], 79,"Gas giant",		   1898,  4331, 0.41354,  	23.1, 5.20288700,	0.04838624,	1.30439695,	34.39644051,  14.72847983,	100.47390909,-0.00011607,-0.00013253,-0.00183714, 3034.74612775,	0.21252668,	0.20469106);
	planet[5] = new Body("Saturn", 	9.14017 * EarthRToAU , '#eac757', img[6], 82,"Gas giant", 		   568,	  10747, 0.44401, 	9.0,  9.53667594,	0.05386179,	2.48599187,	49.95424423,  92.59887831,	113.66242448,-0.00125060,-0.00050991,0.00193609,  1222.49362201,	-0.41897216,-0.28867794);
	planet[6] = new Body("Uranus", 	3.98085 * EarthRToAU , '#99c3c4', img[7], 27,"Ice giant", 		   86.8,  30589, -0.71833, 	8.7,  19.18916464,	0.04725744,	0.77263783,	313.23810451, 170.95427630,	74.01692503, -0.00196176,-0.00004397,-0.00242939, 428.48202785,		0.40805281,	0.04240589);
	planet[7] = new Body("Neptune", 3.8647  * EarthRToAU , '#4985ff', img[8], 14,"Ice giant", 		   102,	  59800, 0.67125, 	11.0, 30.06992276,	0.00859048,	1.77004347,	-55.12002969, 44.96476227,	131.78422574,0.00026291, 0.00005105, 0.00035372,  218.45945325,		-0.32241464,-0.00508664);
}

function draw() {
	translate(width/2, height/2); // (0,0 at center)
	scale(zoom); //zoom is set in mouseWheel(event) 
	background(40, 40, 40); 

  	let date;
  	if (time.day < 10) { date =  "0" + time.day + "." + time.month + "." + time.year;} 
  	else { date = time.day + "." + time.month + "." + time.year; }
  	document.getElementById('date').innerHTML = date; //show date

  	for (let i = 0; i < planet.length; i++) { 
		planet[i].orbit(false); 
	}
	
  	sun.update();
  	if (!hiddenSun){sun.show();} 
	if (hiddenSun){  //draw a dot instead of sun 
	  	strokeWeight(3 / zoom);
		stroke('yellow');
		point(0, 0);
	}

	for (let i = 0; i < planet.length; i++) { //update position of all planets and display them
		planet[i].update();
		planet[i].show();
	}

	for (let i = 0; i < planet.length; i++) { 
		if (planet[i].selectionStatus) {planet[i].infoWindow(); } //show information if planet is selected
	}


	if (pausePlay) {increaseDate(1);}
}


function Body(_name, _radius, _tex, img, moons, type, mass, lengthOfYear, LengthOfDay, gravity, a, e, i, L, w, o, ra, re, ri, rL, rw, ro) {	
 	this.name = _name;
 	this.gravity = gravity; 
 	this.radius = _radius * planetSizeFactor * AuToScreen; 
 	this.pos = createVector(0, 0); 
 	this.path = [];
 	this.selectionStatus = false;


 	this.show = function(){
 		this.radius = _radius * planetSizeFactor * AuToScreen; 
 		noStroke(); 		
		fill(_tex); 
		ellipse(this.pos.x , this.pos.y, this.radius * 2); //draw planet

		if (!hiddenNames){
			noStroke();
		   	textSize(12/zoom);
			fill('white');
			textAlign(LEFT);
			text(_name, this.pos.x + 12/zoom , this.pos.y );//draw planet name
		}

		if (this.radius < 10){
			strokeWeight(0.3/zoom); 
			stroke('white');
			noFill();
	   		ellipse(this.pos.x, this.pos.y, 12/zoom); //draw circle around planet
 		}
 	}

 	this.orbit = function(startDraw){

 		if (startDraw == true){
 			this.path.push(this.pos.copy());
 		}
	
	   	stroke(_tex);  	
	   	if (this.selectionStatus) { strokeWeight(2/zoom);} //if selected, draw orbit thicker 
	   	else {strokeWeight(0.5/zoom);} 


	   	for (let i = 0; i < this.path.length - 2; i++) {
	   		line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y,);
	   	}

 	}

 	let aNow; //Generated a
 	let eNow;
 	let iNow;
 	let oNow;
 	let wNow;
 	let trueAnom;
 	let lastPos = createVector(0, 0);


	this.update = function(){ // partly taken from / inspired by http://www.planetaryorbits.com/tutorial-javascript-orbit-simulation.html
		
		lastPos = this.pos;

		aNow =  a + ra * time.transDate;			//Orbit size in AU, Semi-major axis 
		eNow =  e + re * time.transDate;			//Orbit Shape		(eccentricity)
		iNow = (i + ri * time.transDate) % 360;		//Orbit orientation (Orbital Inclination)
		oNow = (o + ro * time.transDate) % 360;  	//					(Longitude of ascending node)
		wNow = (w + rw * time.transDate) % 360; 	//					(Longitude of the Perihelion)
		if (wNow < 0) { wNow = 360 + wNow;} 
		let LGen = (L + rL * time.transDate) % 360;		// Mean Longitude
		if (LGen < 0) { LGen = 360 + LGen;} 

		//Mean anomaly 
		let meanAnom = LGen - (wNow);
		if (meanAnom < 0) {meanAnom = 360 + meanAnom;}

		//Eccentric anomaly (partly taken from http://www.jgiesen.de/kepler/kepler.html)
		eccentAnom = EccAnom(eNow, meanAnom);

		//argument of true anomaly
		trueAnomalyArg = (Math.sqrt((1 + eNow) / (1 - eNow))) * (Math.tan(toRadians(eccentAnom) / 2));

		//true anomaly = angular distance of the planet from the perihelion of the planet
		K = Math.PI / 180.0; //Radian converter variable
		if (trueAnomalyArg < 0){ 
			trueAnom = 2 * (Math.atan(trueAnomalyArg) / K + 180); //https://en.wikipedia.org/wiki/True_anomaly#From_the_eccentric_anomaly
		}
		else{
			trueAnom = 2 * (Math.atan(trueAnomalyArg) / K);
		}

		//let radius = aNow * (1 - (eNow * (Math.cos(toRadians(eccentAnom))))); 				//https://en.wikipedia.org/wiki/Eccentric_anomaly#Radius_and_eccentric_anomaly
		let radius = aNow * ((1 - eNow * eNow) / ( 1 + eNow * Math.cos(toRadians(trueAnom)))); 	//https://en.wikipedia.org/wiki/True_anomaly#Radius_from_true_anomaly
		//radius = distance from the planet to the focus of the ellipse 

		
		//taken from http://www.stargazing.net/kepler/ellipse.html#twig04 and https://farside.ph.utexas.edu/teaching/celestial/Celestial/node34.html
		//determine Heliocentric Ecliptic Coordinates				
		xGen = radius * (Math.cos(toRadians(oNow)) * Math.cos(toRadians(trueAnom + wNow - oNow)) - Math.sin(toRadians(oNow)) * Math.sin(toRadians(trueAnom + wNow - oNow)) * Math.cos(toRadians(iNow)));
		yGen = radius * (Math.sin(toRadians(oNow)) * Math.cos(toRadians(trueAnom + wNow - oNow)) + Math.cos(toRadians(oNow)) * Math.sin(toRadians(trueAnom + wNow - oNow)) * Math.cos(toRadians(iNow)));
		//zGen = radius * (Math.sin(toRadians(trueAnom + wNow - oNow))*Math.sin(toRadians(iNow)));

		this.pos = createVector( yGen * AuToScreen, xGen * AuToScreen);

		this.velocity = dist(this.pos.x / AuToScreen, this.pos.y / AuToScreen, lastPos.x / AuToScreen, lastPos.y/ AuToScreen) * 149597870.7 / 24 / 60 / 60; 
	}

	this.clicked = function(x, y){ //called by mousePressed(); returns distance between planet and click
		let d = dist(0, 0, x, y);
		 	
		let dplanet = dist(0, 0, this.pos.x, this.pos.y)
		dplanet *= zoom; 

		return Math.abs(d - dplanet); 
	}

	this.infoWindow = function(){
		fill(_tex);
		rect(-width/2/zoom, height/5/zoom, width/zoom, height/3/zoom);	
		textSize(70/zoom*width/1920);
		fill('black');
		textAlign(LEFT);
		let EarthRToAU = 0.000042588;
		//Name
		text(_name,-width/2.06/zoom,  height/3.75/zoom);
		
		//Image
		image(img, -width/2.06/zoom, height/3.5/zoom, 320/zoom/1.3*width/1920, 240/zoom/1.3*width/1920);

		//Distance From Sun
		textSize(25/zoom*width/1920);
		text("≈ " + Math.round(dist(0, 0, this.pos.x, this.pos.y) / AuToScreen * 149597900) + " Km", -width/3/zoom,  height/3.2/zoom);
		text("≈ " +(Math.round(dist(0, 0, this.pos.x, this.pos.y) / AuToScreen * 10000) / 10000) + " AU", -width/3/zoom,  height/2.9/zoom);
		textSize(15/zoom*width/1920);
		text("Momentary distance from sun", -width/3/zoom, height/2.7/zoom);

		//Planet Radius From Sun in KM
		textSize(25/zoom*width/1920);
		text("≈ " +(Math.round(this.radius/planetSizeFactor/AuToScreen * 149597900 * 1000) / 1000)+ " Km", -width/3/zoom,  height/2.4/zoom);
		text("≈ " +(Math.round(_radius / EarthRToAU * 100)/100)+ " relative to earth", -width/3/zoom,  height/2.25/zoom);
		textSize(15/zoom*width/1920);
		text("Planet radius", -width/3/zoom, height/2.15/zoom);
		
		//Moons
		textSize(25/zoom*width/1920);
		text( moons, -width/5.5/zoom,  height/3.2/zoom);
		textSize(15/zoom*width/1920);
		text("Number of moons", -width/5.5/zoom, height/3/zoom);

		//Planettype
		textSize(25/zoom*width/1920);
		text( type, -width/5.5/zoom,  height/2.65/zoom);
		textSize(15/zoom*width/1920);
		text("Type", -width/5.5/zoom, height/2.5/zoom);

		//Mass
		textSize(25/zoom*width/1920);
		text( "≈ " + mass + "*10^24 kg" , -width/5.5/zoom,  height/2.25/zoom);
		textSize(15/zoom*width/1920);
		text("Mass", -width/5.5/zoom, height/2.15/zoom);

		//Time for Light to reach planet
		textSize(25/zoom*width/1920);
		text( "≈ " +(Math.round(dist(0, 0, this.pos.x, this.pos.y) / AuToScreen * 10000 * 8.31675 ) / 10000) + " minutes", -width/25/zoom,  height/3.2/zoom);
		textSize(15/zoom*width/1920);
		text("One way light time to the sun", -width/25/zoom, height/3/zoom);

		//velocity
		textSize(25/zoom*width/1920);
		text( "≈ " + Math.round(this.velocity*100)/100 + " km/s", -width/25/zoom,  height/2.65/zoom);
		textSize(15/zoom*width/1920);
		text("velocity", -width/25/zoom, height/2.5/zoom);

		//Length of Year
		textSize(25/zoom*width/1920);
		text( "≈ " +(HoursDaysYears(lengthOfYear)) , -width/25/zoom,  height/2.25/zoom);
		textSize(15/zoom*width/1920);
		text("Length of Year", -width/25/zoom, height/2.15/zoom);	

		//gravity
		textSize(25/zoom*width/1920);
		text( "≈ " + this.gravity + "m/s^2", width/10/zoom, height/3.2/zoom);
		text((Math.round(this.gravity / planet[2].gravity * 1000) / 1000) + " relative to earth", width/10/zoom,  height/2.9/zoom);
		textSize(15/zoom*width/1920);
		text("Gravity", width/10/zoom, height/2.7/zoom); 
 		
 		//Planet Radius From Sun in KM
		let rotation = "Direct"; //direct rotation

		let temp = LengthOfDay;

		if (LengthOfDay < 0) {
			rotation = "Retrograde";
			temp *= -1;
		} 

		textSize(25/zoom*width/1920);
		text("≈ " +(HoursDaysYears(temp)) , width/10/zoom,  height/2.4/zoom);
		text(rotation, width/10/zoom,  height/2.25/zoom);
		textSize(15/zoom*width/1920);
		text("Duration of a day, Rotation", width/10/zoom, height/2.15/zoom);


		//Keplerian elements 
		textSize(20/zoom*width/1920);
		text("Semimajor axis (a) = " + Math.round(aNow*1000)/1000 + " AU", width/3.5/zoom,   height/3.2/zoom);
		text("Eccentricity (e) = " + Math.round(eNow*1000)/1000, width/3.5/zoom,  height/2.93/zoom);
		text("Inclination (i) = " + Math.round(iNow*1000)/1000 + "°", width/3.5/zoom,   height/2.71/zoom);
		text("Longitude of the ascending node (Ω)  = " + Math.round(oNow*1000)/1000 + "°", width/3.5/zoom,  height/2.52/zoom);
		text("Longitude of perihelion (ϖ) = " + Math.round(wNow*1000)/1000 + "°", width/3.5/zoom,   height/2.37/zoom);
		text("True anomaly (θ) = " + Math.round(trueAnom*1000)/1000 + "°", width/3.5/zoom,  height/2.25/zoom);

		textSize(15/zoom*width/1920);
		text("Keplerian elements", width/3.5/zoom, height/2.15/zoom);

	}
}

function EccAnom(ec, m) {  //https://en.wikipedia.org/wiki/Kepler%27s_equation#Numerical_approximation_of_inverse_problem
	// arguments: 		 
	// ec = eccentricity, m = mean anomaly,

	let i = 0;
	let delta = Math.pow(10,- 6);
	let E;

	m = m / 360.0;
	m = 2.0 * Math.PI * (m - Math.floor(m));
	E = m;

	while ((Math.abs((E - ec * Math.sin(E) - m)) > delta) && (i < 30)) {
		E = E - ((E - ec * Math.sin(E) - m) / (1.0 - ec * Math.cos(E)));
		i ++;   //f(E) = E - ec * sin(E) - m  // f'(E) = 1 - ec * cos(E) 
	}

	E = E / ( Math.PI / 180.0);

	return Math.round(E * Math.pow(10, 6)) / Math.pow(10, 6);
}

function drawOrbit(){ 
	
	scale(zoom); 

	aproxDaysToOrbit = [89, 228, 371, 698, 4500, 11000, 31000, 60700];

	let l;

	let j = 0; 
	translate(width/2, height/2);
	
	for (let i = 0; i < planet.length; i++) {
		time.current = new Date(time.current.getFullYear() - 1, time.current.getMonth(), time.current.getDate());
	dateToTransDate();
		do {
		 
			planet[i].update();
			planet[i].orbit(true); //puts orbit into path[]  in the orbit function

			switch (i) { //the more days needed for full orbit, the more days are skipped
			  case 0:
			    l = 1;
			    break;
			  case 1:
			    l = 3;
			    break;
			  case 2:
			    l = 3;
			    break;
			  case 3:
			    l = 6;
			    break;
			  case 4:
			    l = 60;
			    break;
			  case 5:
			    l = 120;
			    break;
			  case 6:
			    l = 240;
			    break;
			} 

			increaseDate(l);
			
			j += l;

		} while (j <= aproxDaysToOrbit[i]);

		j = 0;
	}

	time.current = time.startingDate;
	dateToTransDate();

}

function toRadians(deg){
	return deg * (Math.PI / 180);
}

function mousePressed() {
	let a = []; 
	for (let i = 0; i < planet.length; i++) {
		a[i] = planet[i].clicked(mouseX - width/2 , mouseY - height/2);		
	}


	for (let i = 0; i < planet.length; i++) {
		planet[i].selectionStatus = false;
	}

	if (Math.min(...a) < 30) { //if click was close enough select planet
		let min = a.indexOf(Math.min(...a)) //if more planets are in range chose closest one
		planet[min].selectionStatus = true; 
	}

}

function mouseWheel(event) {

	let sensativity =  0.001;

	
  	if (zoom <= 0.5 ){
  		sensativity = 0.0008;
  	}

  	if (zoom <= 0.2 ){
  		sensativity = 0.0001;
  	}

 	zoom -= sensativity * event.delta;
 	zoom = constrain(zoom, 0.04, 100); 
 	 
 	 return false;

}

function HoursDaysYears(days){ 
	
	let str = "";

	if (days >= 365){
		let y = Math.floor(days/365);
		if (y == 1) {str += y + " year";}
		else {str += y + " years";}

		let d = Math.round((days % 365) * 100) / 100 ;
		if (d == 1) {str += ", " + d + " day ";}
		else if (d != 0 && d != 1) { str += ", " +  d + " days ";}
		return (str);
	}

	if (days < 365) {

		let d = Math.floor(days);

		if (d == 1) {str += (d + " day"); }
		else if (d != 0 && d != 1) {str += (d + " days");}


		let h = Math.round((days - d) * 24 * 100) / 100;

		if (d != 0 && h!= 0) {str += ", "; }
		if (h != 0) { str +=  h + " hours ";}

		return (str);
	}

}

function PlanetSizeChange(a) {
	planetSizeFactor = a; 
}

function playPause() {
	
	if (pausePlay){ 
		pausePlay = false;
	}
	else {
		pausePlay = true;
	}	
}

function HideSun() {

	if (hiddenSun){
		hiddenSun = false;
		document.getElementById('Sun').innerHTML = "Hide Sun";
	}
	else {
		hiddenSun = true; 
		document.getElementById('Sun').innerHTML = "Show Sun";
	}

}

function HideNames() {

	if (hiddenNames){
		hiddenNames = false;
		document.getElementById('Names').innerHTML = "Hide Names";
	}
	else {
		hiddenNames = true; 
		document.getElementById('Names').innerHTML = "Show Names";
	}

}

function zoomChange(change){
	zoom = change;
}