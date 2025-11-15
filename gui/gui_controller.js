/* gui_controller.js - manages module panel and interactions */
document.addEventListener('DOMContentLoaded', ()=>{

  const buttons = document.querySelectorAll('.menu-btn');
  const panel = document.getElementById('module-panel');
  const backdrop = document.getElementById('module-backdrop');
  const panelTitle = document.getElementById('module-title');
  const panelContent = document.getElementById('module-content');
  const panelClose = document.getElementById('panel-close');
  const fs = document.getElementById('fullscreen-overlay');
  const fsClose = document.getElementById('fs-close');
  const fsContent = document.getElementById('fs-content');
  const chatLog = document.getElementById('chat-log');

  function openModule(id){
    panelTitle.innerText = id.toUpperCase();
    panelContent.innerHTML = '<div class="small">読み込み中…</div>';
    if(id==='chat'){
      panelContent.innerHTML = '<h3>チャットモジュール</h3><div style="height:300px;overflow:auto" id="module-chat-log"></div><div style="margin-top:8px"><input id="module-input" placeholder="ここで発話できます" style="width:70%"></input><button id="module-send">送信</button></div>';
      document.getElementById('module-send').onclick = async ()=>{
        const t = document.getElementById('module-input').value.trim(); if(!t) return;
        const ml = document.getElementById('module-chat-log');
        const p = document.createElement('div'); p.textContent = 'ゆう: '+t; ml.appendChild(p);
        const reply = await window.chatCore.query(t);
        const r = document.createElement('div'); r.textContent = 'サカっち: '+reply; ml.appendChild(r);
      };
    }else if(id==='world'){
      panelContent.innerHTML = '<h3>ワールド詳細</h3><pre id="module-world" class="small">読み込み中…</pre>';
      fetch('/docs/world_model.json').then(r=>r.json()).then(j=>{ document.getElementById('module-world').textContent = JSON.stringify(j,null,2)}).catch(()=>{});
    }else if(id==='persona'){
      panelContent.innerHTML = '<h3>人格詳細</h3><pre id="module-persona" class="small">読み込み中…</pre>';
      fetch('/sync_bridge/sync_state.json').then(r=>r.json()).then(j=>{ document.getElementById('module-persona').textContent = JSON.stringify(j,null,2)}).catch(()=>{});
    }else if(id==='events'){
      fsContent.innerHTML = '<h2>周辺イベント</h2><div id="events-list">読み込み中…</div>';
      fetch('/docs/events.json').then(r=>r.json()).then(j=>{
        const el = document.getElementById('events-list'); el.innerHTML='';
        if(Array.isArray(j.events)) j.events.forEach(e=>{ const d=document.createElement('div'); d.innerHTML='<strong>'+e.title+'</strong><div class="small">'+e.date+'</div><p>'+e.summary+'</p>'; el.appendChild(d)});
      }).catch(()=>{ document.getElementById('events-list').innerText='イベント情報がありません' });
      fs.classList.add('active'); fs.setAttribute('aria-hidden','false');
      return;
    }else if(id==='system'){
      panelContent.innerHTML = '<h3>システム</h3><button id="ping-server">サーバーピング</button><pre id="ping-out" class="small"></pre>';
      document.getElementById('ping-server').onclick = async ()=>{
        try{ const r = await fetch('/server/health'); const j = await r.json(); document.getElementById('ping-out').textContent = JSON.stringify(j,null,2); }
        catch(e){ document.getElementById('ping-out').textContent = 'サーバー応答なし' }
      };
    }else{
      panelContent.innerHTML = '<div class="small">未実装モジュール</div>';
    }

    panel.classList.add('open'); panel.setAttribute('aria-hidden','false'); backdrop.classList.add('visible');
  }

  buttons.forEach(b=> b.addEventListener('click', ()=> openModule(b.dataset.module) ));

  function closePanel(){ panel.classList.remove('open'); panel.setAttribute('aria-hidden','true'); backdrop.classList.remove('visible'); }
  panelClose.addEventListener('click', closePanel); backdrop.addEventListener('click', closePanel);

  fsClose.addEventListener('click', ()=>{ fs.classList.remove('active'); fs.setAttribute('aria-hidden','true'); });

  document.getElementById('send-btn').addEventListener('click', async ()=>{
    const v = document.getElementById('user-input').value.trim(); if(!v) return;
    const b = document.createElement('div'); b.className='chat-bubble you'; b.innerText = v; chatLog.appendChild(b);
    document.getElementById('user-input').value='';
    const thinking = document.createElement('div'); thinking.className='chat-bubble saka'; thinking.innerText='思考中…'; chatLog.appendChild(thinking);
    const reply = await window.chatCore.query(v);
    chatLog.removeChild(thinking);
    const rb = document.createElement('div'); rb.className='chat-bubble saka'; rb.innerText = reply; chatLog.appendChild(rb);
  });

  document.getElementById('user-input').addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); document.getElementById('send-btn').click(); } });

});
