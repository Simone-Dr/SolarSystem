# SolarSystem

[This](https://simone-dr.github.io/SolarSystem/) is a two-dimensional simulation of our solar system to scale, written in Javascript while using the p5 library for the plotting.  

## Contents
* real-time planetary movement at the current date or a manually set date
* possibility to change the scale of the planets and the sun
* clicking on planets reveals further information like velocity, mass, etc.

## Keplerian Elements 
The Positions are calculated with the Keplerian Elements and are therefore only approximations to the real values.

### Shape and Size
* a : semi-major axis [au]
  * It defines the size of the orbit, being the sum of the farthest (aphelion) and nearest (perihelion) points reached by the planet with respect to the sun divided by to.
* e : eccentricity
  * It defines the shape of the ellipse, describing how much it is elongated. 0 forms a circle and values in between 0 and 1 an elliptic orbit.

### Orientation
* i : inclination [degrees]
  * The inclination describes the tilt of the orbit in regards to a reference in this case the ecliptic, which is the plane in which the Earth orbits the Sun.
* Ω/o* : Longitude of the Ascending Node [degrees]
  * It horizontally orients the ellipse where the orbit passes upward through the ecliptic
* ϖ/w* : Longitude of Perihelion [degrees]
  * It defines the angular rotation of the orbit in regards to the point of Perihelion (Point on orbit closest to the sun)

### Position
* L : Mean Longitude [degrees]
  * Measures the angle of the planet if it would move in a perfect circle. To increase the accuracy it is transformed to the true anomaly, which defines the position of the orbiting body along the ellipse

--* variable used in code


## How calculating the position works: 
our Gregorian Date is transferred to the Julien Date which gives the date in days since 4713 BC. This is then changed to give the time measured in Julian centuries (36525 days) since Jan 2000. 

Every planet is initialized with their Keplerian elements as well as the rates at which they change every Julian century. Those Elements only display the orbits in a specific window of time, which is why this simulation is most accurate for the time interval 1800 AD - 2050 AD.

In draw(), a p5 function that is set to loop 30 times per second, the date increases by one day each loop. The planet[i].update() function is called as well and processes the date and the elements to generate the position of the planet.

```javascript
aNow =  a + ra * time.transDate;			// Semi-major axis 
eNow =  e + re * time.transDate;			// (eccentricity)
iNow = (i + ri * time.transDate) % 360;		// (Orbital Inclination)
oNow = (o + ro * time.transDate) % 360;  	// (Longitude of ascending node)
wNow = (w + rw * time.transDate) % 360; 	// (Longitude of the Perihelion)
if (wNow < 0) { wNow = 360 + wNow;} 
	let LGen = (L + rL * time.transDate) % 360;	// Mean Longitude
if (LGen < 0) { LGen = 360 + LGen;} 
	let meanAnom = LGen - (wNow);				//Mean anomaly 
if (meanAnom < 0) {meanAnom = 360 + meanAnom;}
```

Then, we calculate the eccentric anomaly using Newton's Method and the Mean anomaly. 

```javascript
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
```

With the eccentric anomaly, we calculate the true anomaly. 

```javascript
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
```

* After using the true anomaly, the eccentricity and the Semi-major axis to calculte the radius vector, which is the distance between the planet and the Sun
```javascript
let radius = aNow * ((1 - eNow * eNow) / ( 1 + eNow * Math.cos(toRadians(trueAnom)))); 	//https://en.wikipedia.org/wiki/True_anomaly#Radius_from_true_anomaly
```

we can get the Heliocentric coordinates of the planet using the radius vector, the true anomaly, the longitude of perihelion, the longitude of ascending node and the inclination. 
```javascript
//taken from http://www.stargazing.net/kepler/ellipse.html#twig04 explained at https://farside.ph.utexas.edu/teaching/celestial/Celestial/node34.html
xGen = radius * (Math.cos(toRadians(oNow)) * Math.cos(toRadians(trueAnom + wNow - oNow)) - Math.sin(toRadians(oNow)) * Math.sin(toRadians(trueAnom + wNow - oNow)) * Math.cos(toRadians(iNow)));
yGen = radius * (Math.sin(toRadians(oNow)) * Math.cos(toRadians(trueAnom + wNow - oNow)) + Math.cos(toRadians(oNow)) * Math.sin(toRadians(trueAnom + wNow - oNow)) * Math.cos(toRadians(iNow)));
zGen = radius * (Math.sin(toRadians(trueAnom + wNow - oNow))*Math.sin(toRadians(iNow)));
```


## Credits
* My biggest source of information was NASA
  * [The Keplerian Elements](https://ssd.jpl.nasa.gov/?planet_pos)
  * [Explanation of working with the Keplerain Elements](https://ssd.jpl.nasa.gov/txt/aprx_pos_planets.pdf)
  * [Physical Characteristics of the planets](https://ssd.jpl.nasa.gov/?planet_phys_par)
  * [Planetary Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/)
  * [Pictures of the planets](https://solarsystem.nasa.gov/planets/overview/)
  * [Nasas Orrery for checking accuracy](https://eyes.nasa.gov/apps/orrery/#/home)

* The way the planet positions are calculated is inspired by [Chris A Jager](http://www.planetaryorbits.com/tutorial-javascript-orbit-simulation.html)'s orrery. He did a great job at explaining the [Keplerian Elements](http://www.planetaryorbits.com/kepler-laws-orbital-elements.html) with text and visualization, as well. 

* To calculate the Julian Date I read [Robert Braeunig](//http://www.braeunig.us/space/plntpos.htm#julian)'s explanation.

* To calculate the Eccentric Anomaly there is no closed-form solution which is why Newton's method is used. The code for this is inspired by [J. Giesen](http://www.jgiesen.de/kepler/kepler.html) and [Wikipedia](https://en.wikipedia.org/wiki/Kepler%27s_equation#Numerical_approximation_of_inverse_problem).

* [Keith Burnett](http://www.stargazing.net/kepler/ellipse.html#twig04)'s formulas for calculating the Heliocentric coordinates are used. They are explained [here](https://farside.ph.utexas.edu/teaching/celestial/Celestial/node34.html).

* p5.js library is currently led by [Moira Turner](https://github.com/mcturner1995) and was created by [Lauren Lee McCarthy](https://lauren-mccarthy.com/)
