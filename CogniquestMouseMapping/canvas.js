/**@type {HTMLCanvasElement}*/
const canvas = document.getElementById("canvas"); 
const ctx = canvas.getContext("2d"); 

canvas.width = 960; 
canvas.height = 540; 

// Draw the map 
const img = new Image(); 
img.src = "worldmap.jpg"; 
img.addEventListener("load", function() { 
    ctx.drawImage(img, 0, 0, 960, 960); }); 

canvas.addEventListener("click",function(event){
    let x= event.offsetX;
    let y= event.offsetY;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x,y,5,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();
    console.log(x, y);
})