/*
chat_core.js - front-end connector
tries local server /server/chat and falls back to demo
exposes function window.chatCore.query(prompt)
*/
window.chatCore = {
  async query(prompt){
    // try local server endpoint
    try{
      const res = await fetch('/server/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt})});
      if(res.ok){
        const j = await res.json();
        return j.reply || j;
      }
    }catch(e){ console.log('local server unavailable', e); }
    // fallback: simple echo
    return '（デモ応答）その問いは面白い。詳しく教えてください。';
  }
};
