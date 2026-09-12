const SHELL='modo-campo-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(SHELL).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.hostname.includes('tile.openstreetmap.org')){
    e.respondWith(caches.open('campo-tiles-v1').then(async c=>{const hit=await c.match(e.request);if(hit)return hit;try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}catch(_){return new Response('',{status:504})}}));return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{if(e.request.method==='GET'&&resp.ok)caches.open(SHELL).then(c=>c.put(e.request,resp.clone()));return resp}).catch(()=>caches.match('./index.html'))));
});
