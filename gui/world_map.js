/* world_map.js - simple canvas renderer reading docs/world_model.json */
(async function(){
  const canvas = document.getElementById('world-map-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
  window.addEventListener('resize', resize); resize();

  let model = null;
  try{
    const res = await fetch('/docs/world_model.json', {cache:'no-store'});
    if(res.ok) model = await res.json();
  }catch(e){}

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#021b29'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = '#0af'; ctx.lineWidth = 3;
    const w = 220, h = 120; const cx = canvas.width/2 - w/2, cy = canvas.height/2 - h/2;
    ctx.strokeRect(cx, cy, w, h);
    ctx.fillStyle='#0af'; ctx.font='16px sans-serif';
    ctx.fillText('Stadium Core', cx+20, cy-8);
    ctx.strokeStyle = '#0f0'; ctx.beginPath(); ctx.arc(canvas.width/2, canvas.height/2, 160,0,Math.PI*2); ctx.stroke();
  }
  draw(); setInterval(draw,2000);
})();
