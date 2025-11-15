/* persona_status.js - updates sync meter and persona info by polling sync_bridge/sync_state.json */
(async function(){
  async function update(){
    try{
      const res = await fetch('/sync_bridge/sync_state.json', {cache:'no-store'});
      if(!res.ok) throw new Error('no state');
      const s = await res.json();
      const pct = Math.round((s.sync_rate||0)*100);
      const meter = document.getElementById('sync-meter');
      if(meter) meter.style.width = pct + '%';
      const gauge = document.getElementById('sync-gauge');
      if(gauge) gauge.innerText = 'SYNC ' + pct + '%';
      const pi = document.getElementById('persona-info');
      if(pi) pi.textContent = JSON.stringify(s,null,2);
    }catch(e){
      // no-op
    }
  }
  update(); setInterval(update,3000);
})();
