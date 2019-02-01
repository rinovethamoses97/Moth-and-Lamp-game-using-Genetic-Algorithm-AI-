var populationSize=200;
var population=[];
var target=new Object();
var obstacle=new Object();
var lifetime=100;
var step=0;
var generations=0;
var pool=[];
var mutationRate=0.01;
var bestPopulation;
var bestScore=0;
var gamestatus=0;
function setup(){
	createCanvas(800,600);
	background(0);
	target.x=700;
	target.y=height/2;
	obstacle.x=0;
	obstacle.y=height/2;
	for(var i=0;i<populationSize;i++){
		population[i]=new Object();
		population[i].fitness=0;
		population[i].gene=[];
		population[i].pos=new Object();
		population[i].pos.x=400;
		population[i].pos.y=580;
		population[i].dead=false;
		population[i].deadbyobstacle=false;
		for(var j=0;j<lifetime;j++){
			population[i].gene[j]=new Object();
			population[i].gene[j].x=random(-8,8)
			population[i].gene[j].y=random(-8,8);
		}

	}
}
function alldead(){
	for(var i=0;i<populationSize;i++){
		if(!population[i].dead)
			return false;
	}
	return true;
}
function evaluate(){
	for(var i=0;i<populationSize;i++){
		if(collideRectRect(population[i].pos.x,population[i].pos.y,10,10,target.x,target.y,10,10)){
			return true;
		}		
	}
	return false;
}
function manhattan(x1,y1,x2,y2){
	return (abs(x2-x1)+abs(y2-y1));
}
function calculateFitness(){
	for(var i=0;i<populationSize;i++){
		if(population[i].deadbyobstacle){
			population[i].fitness=0.0009*(1/dist(population[i].pos.x,population[i].pos.y,target.x,target.y));
		}
		else{
			population[i].fitness=1/dist(population[i].pos.x,population[i].pos.y,target.x,target.y);
		}
	}
}
function findbest(){
	var temp_score=0;
	var temp_population;
	for(var i=0;i<populationSize;i++){
		if(population[i].fitness>temp_score){
			temp_score=population[i].fitness;
			temp_population=population[i];
		}
	}
	bestPopulation=temp_population;
	bestScore=temp_score;
}
function crossover(parenta,parentb){
	var child=new Object();
	child.dead=false;
	child.deadbyobstacle=false;
	child.fitness=0;
	child.pos=new Object();
	child.pos.x=400;
	child.pos.y=580;
	child.gene=[];
	var midpoint=floor(lifetime/2);
	for(var i=0;i<lifetime;i++){
		child.gene[i]=new Object();
		if(i>midpoint){
			child.gene[i].x=parenta.gene[i].x;
			child.gene[i].y=parenta.gene[i].y;
		}
		else{
			child.gene[i].x=parentb.gene[i].x;
			child.gene[i].y=parentb.gene[i].y;
		}
	}
	return child;
}
function mutate(child){
	for(var i=0;i<lifetime;i++){
		if(random(1)<mutationRate){
			child.gene[i].x=random(-8,8);
			child.gene[i].y=random(-8,8);
		}
	}
	return child;
}
function compare(a,b){
	if (a.fitness > b.fitness)
     	return -1;
  	if (a.fitness < b.fitness)
    	return 1;
  	return 0;
}
function naturalSelection(){
	pool=[];
	for(var i=0;i<populationSize;i++){
		var score=floor(population[i].fitness*100000);
		for(var j=0;j<score;j++)
			pool.push(population[i]);
	}
	pool.sort(compare);
	for(var i=0;i<populationSize;i++){
		var rand=floor(random(0,pool.length/2));
		var parenta=pool[rand];
		rand=floor(random(0,pool.length/2));
		var parentb=pool[rand];
		var child=crossover(parenta,parentb);
		child=mutate(child);
		population[i]=child;
	}
}
// Replaced by p5.js collision detection libarary
// function collisioncheck(x,y){
// 	if((x+(10)>=obstacle.x && x+(10)<=obstacle.x+(600)) && (y+(10)>=obstacle.y && y+(10)<=obstacle.y+(10))){
//     	return true;
//     }
//     else if((x>=obstacle.x && x<=obstacle.x+(600))&&(y>=obstacle.y && y<=obstacle.y+(10))){
//     	return true;
//     }
//     return false;
// }
function draw(){
	
	background(0);
	fill(0,0,255);
	rect(obstacle.x,obstacle.y,600,10);
	fill(0,255,0);
	rect(target.x,target.y,10,10);
	fill(255,0,0);
	for(var i=0;i<populationSize;i++){
		if(!population[i].dead){
			if(population[i].pos.x+population[i].gene[step].x<0 ||population[i].pos.x+population[i].gene[step].x>790 ||population[i].pos.y+population[i].gene[step].y>590|| population[i].pos.y+population[i].gene[step].y<0||collideRectRect(population[i].pos.x+population[i].gene[step].x,population[i].pos.y+population[i].gene[step].y,10,10,obstacle.x,obstacle.y,600,10)){
				population[i].dead=true;
				population[i].deadbyobstacle=true;
			}
			rect(population[i].pos.x+=population[i].gene[step].x,population[i].pos.y+=population[i].gene[step].y,10,10)
		}
	}
	step++;
	if(step==lifetime-1){
		step=0;
		for(var i=0;i<populationSize;i++){
			population[i].dead=true;
		}
	}
	if(evaluate()){
		if(gamestatus==0){
			gamestatus=1;
			target.x=width/2;
			target.y=10;
		}
		else if(gamestatus==1){
			gamestatus=2;
		}
	}
	fill(255);
	text("Best Score= "+bestScore,0,10);
	text("Generations= "+generations,0,30);
	if(gamestatus==2){
		fill(0,255,0);
		text("Won",0,50);
	}
	if(alldead()){
		generations++;
		calculateFitness();	
		findbest();
		console.log("Best Score= "+bestScore);
		naturalSelection();
		if(generations%2==0){
			for(var i=0;i<populationSize;i++){	
				for(var j=lifetime;j<lifetime+15;j++){
					population[i].gene[j]=new Object();
					population[i].gene[j].x=random(-8,8);
					population[i].gene[j].y=random(-8,8);
				}	
			}
			lifetime+=15;
		}
	}

}