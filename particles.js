const canvas = document.getElementById("goldParticles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for(let i=0;i<80;i++){
  particles.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*3+1,
    d: Math.random()*2
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="rgba(255,215,0,0.8)";
  ctx.beginPath();
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    ctx.moveTo(p.x,p.y);
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2,true);
  }
  ctx.fill();
  update();
}

function update(){
  for(let i=0;i<particles.length;i++){
    let p=particles[i];
    p.y += p.d;
    if(p.y>canvas.height){
      p.y=0;
      p.x=Math.random()*canvas.width;
    }
  }
}

setInterval(draw,30);
