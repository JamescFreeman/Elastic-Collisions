let circles = [];

// Gas
let n = 50;
let max_v = 10;
let max_r = 3;

//Liquid
// let n = 50;
// let max_v = 5;
// let max_r = 20;
// const vdw = true;

// let n = 25;
// let max_v = 1;
// let max_r = 25;

let t = 0, dt = 0.5, duration = 10;
let size = 600;

let slider1 = document.getElementById("myRange1");
slider1.value = 50;
slider1.oninput = function() {
	dt = this.value/50
}

let slider2 = document.getElementById("myRange2");
slider2.value = 100;
slider2.oninput = function() {
	size = this.value/50*300
}

let g = 0;
let gravitybox = document.getElementById("gravity");
gravitybox.onclick = function() {
	if (g == 0){
		g = 1;
	} else {
		g = 0;
	}
}


function setup() {
  createCanvas(size, size);
  background(50);

  let protection = 0;
  while(circles.length < n){
  	let circle = {
		num: random(100),
  		r: max_r,
  		v_x: random(2*max_v)-max_v,
  		v_y: random(2*max_v)-max_v,
		a: [0,0]
  	}

  	circle.x = random(width - 2*circle.r)+circle.r;
  	circle.y = random(height - 2*circle.r)+circle.r;
	if (circle.num > 90){
		circle.c = [255, 85, 51]
		circle.r = max_r * 2
		circle.m = circle.r*circle.r;
	} else {
		circle.c = [51, 221, 255]
		circle.m = circle.r*circle.r;
	}

  	let overlapping = false;
  	for (j = 0; j < circles.length; j++){
  		let other = circles[j]
  		let d = dist(circle.x,circle.y,other.x,other.y);
  		if (d < circle.r + other.r){
  			overlapping = true;
  			break;
  		}
  	}
  	if(!overlapping){
  		circles.push(circle);
  	}
  	protection++
  	if(protection > 1000){
  		break;
  	}
  for (i = 0; i < circles.length; i++){
  	// fill('rgb('+ circles[i].c +')');
  	ellipse(circles[i].x,circles[i].y,circles[i].r*2,circles[i].r*2);
  }
  	}
  return circles;  
}

let pressure = 0;
let it = 0;
let wallClicksCounter = 0;

pressureAxis = []
timeAxis = []

function draw() {

	background(50);
	let wallClicks = update();
	wallClicksCounter += wallClicks
	if (it % 25 == 0 && it != 0){
		// console.log(wallClicksCounter);
		pressureAxis.push(wallClicksCounter)
		wallClicksCounter = 0;
	}
	it++;
	timeAxis.push(it);

	xArray = timeAxis;
	yArray = pressureAxis;

	let data = [{
		x: xArray,
		y: yArray,
		mode:"lines"
	}];

	let layout = {
		xaxis: {title: "Time"},
		yaxis: {title: "Pressure"},  
	};

	// Define Layout
	// if (timeAxis.length < 100){
	// 	layout = {
	// 		xaxis: {title: "Time"},
	// 		yaxis: {title: "Pressure"},  
	// 	};
	// } else {
	// 	console.log("Entered")
	// 	layout = {
	// 		xaxis: {range: [0, timeAxis[timeAxis.length-1]], title: "Time"},
	// 		yaxis: {range: [0, Math.max(pressureAxis)], title: "Pressure"},  
	// 	};
	// }	

	// Display using Plotly
	// Plotly.newPlot("myPlot", data, layout);
}


function update(){

	let p = 0;

	//x1, y1, x2, y2

	strokeWeight(10); // Beastly
	line((600-size)/2, (600-size)/2, size + (600-size)/2, (600-size)/2) //top
	line((600-size)/2, 600-(600-size)/2, 600-(600-size)/2, 600-(600-size)/2) //bottom
	line((600-size)/2, (600-size)/2, (600-size)/2, 600-(600-size)/2) //left
	line(600-(600-size)/2, (600-size)/2, 600-(600-size)/2, 600-(600-size)/2) //right

	strokeWeight(0);
	// dt = 1;

	for (i = 0; i < circles.length; i++){		

		// circles[i].v_x += circles[i].a[0]*dt;
		// circles[i].v_y += circles[i].a[1]*dt;

		circles[i].v_y += g*dt;					

		circles[i].x += circles[i].v_x*dt;
		circles[i].y += circles[i].v_y*dt;
		
		fill('rgb('+ circles[i].c +')');
  		ellipse(circles[i].x,circles[i].y,circles[i].r*2,circles[i].r*2);

  		if (circles[i].x > 600-(600-size)/2-circles[i].r-5){ //right
			circles[i].x = 600-(600-size)/2-circles[i].r-5;
  			circles[i].v_x = -circles[i].v_x;
			circles[i].x += circles[i].v_x*dt;
			p++;
		}
		if (circles[i].x < (600-size)/2 + circles[i].r+5){ //left
			circles[i].x = (600-size)/2 + circles[i].r+5;
			circles[i].v_x = -circles[i].v_x;
			circles[i].x += circles[i].v_x*dt;
			p++;
		}
  		if (circles[i].y > 600-(600-size)/2-circles[i].r-5){ //bottom
			circles[i].y = 600-(600-size)/2-circles[i].r-5;
  			circles[i].v_y = -circles[i].v_y;
			circles[i].y += circles[i].v_y*dt;
			p++;
  		} 
		if (circles[i].y < (600-size)/2 + circles[i].r+5){ //top
			circles[i].y = (600-size)/2 + circles[i].r+5
			circles[i].v_y = -circles[i].v_y;
			circles[i].y += circles[i].v_y*dt;
			p++;
		}

		D_x = 0;
		D_y = 0;

  		for (j = 0; j < circles.length; j++){

  			if(!(i===j)){

  				let X1 = createVector(circles[i].x,circles[i].y);
  				let V1 = createVector(circles[i].v_x,circles[i].v_y);
  				let V2 = createVector(circles[j].v_x,circles[j].v_y);
  				let X2 = createVector(circles[j].x,circles[j].y);

  				let dx = circles[i].x - circles[j].x;
				D_x += dx;

  				let dy = circles[i].y - circles[j].y;
				D_y += dy;

  				let dist = Math.sqrt(dx*dx + dy*dy);
 
  				if (dist <= circles[i].r + circles[j].r){
  				// console.log("collision!!");

  				let dir = createVector(dx,dy);

  				let dv_x = circles[i].v_x-circles[j].v_x;
  				let dv_y = circles[i].v_y-circles[j].v_y;

  				let v_dir = createVector(dv_x,dv_y);

  				let dot = v_dir.x*dir.x+v_dir.y*dir.y;

  				V1.x = V1.x - 2*circles[j].m/(circles[i].m + circles[j].m) * dot / (dist*dist) * dir.x ;
  				V1.y = V1.y - 2*circles[j].m/(circles[i].m + circles[j].m) * dot / (dist*dist) * dir.y ;

  				dir = createVector(-dx,-dy);

  				V2.x = V2.x - 2*circles[i].m/(circles[i].m + circles[j].m) * dot / (dist*dist) * dir.x ;
  				V2.y = V2.y - 2*circles[i].m/(circles[i].m + circles[j].m) * dot / (dist*dist) * dir.y ;

  				circles[i].v_x = V1.x;
  				circles[i].v_y = V1.y;
  				circles[j].v_x = V2.x;
  				circles[j].v_y = V2.y;

				// dt = dt/50*E/2;				  

  				circles[i].x += 1.05*circles[i].v_x*dt;
				circles[i].y += 1.05*circles[i].v_y*dt; 
				circles[j].x += 1.05*circles[j].v_x*dt;
				circles[j].y += 1.05*circles[j].v_y*dt;

  				}
  			}		

		d = Math.sqrt(D_x**2+D_y**2);
		amag = 0.1*(1/d**12-1/d**6);

  		}
	}

	return p;
}