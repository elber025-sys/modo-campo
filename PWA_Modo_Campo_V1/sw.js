const APP_CACHE = 'modo-campo-app-v1.10.0';
const RUNTIME_CACHE = 'modo-campo-runtime-v1.10.0';

const CORE_LOCAL = [
  './',
  './index.html'
];

const CORE_REMOTE = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/images/layers.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/layers-2x.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache = await caches.open(APP_CACHE);

    // O shell local é obrigatório.
    await cache.addAll(CORE_LOCAL);

    // Dependências externas são salvas individualmente para uma falha
    // momentânea não impedir a instalação do aplicativo.
    for(const url of CORE_REMOTE){
      try{
        const req = new Request(url, {mode:'cors', cache:'reload'});
        const resp = await fetch(req);
        if(resp && (resp.ok || resp.type === 'opaque')){
          await cache.put(url, resp.clone());
        }
      }catch(e){
        console.warn('Não foi possível pré-armazenar:', url, e);
      }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keep = new Set([APP_CACHE, RUNTIME_CACHE, 'campo-tiles-v3', 'modo-campo-pdfs-v7']);
    const keys = await caches.keys();
    await Promise.all(keys.map(k => {
      if(k.startsWith('modo-campo-app-') && !keep.has(k)) return caches.delete(k);
      if(k.startsWith('modo-campo-runtime-') && !keep.has(k)) return caches.delete(k);
      return Promise.resolve();
    }));
    await self.clients.claim();
  })());
});

function isMapTile(url){
  return url.hostname === 'tile.openstreetmap.org' ||
         url.hostname === 'server.arcgisonline.com' ||
         url.hostname.endsWith('.google.com');
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;

  const url = new URL(req.url);

  // Os tiles de mapa são administrados pelo próprio Modo Campo
  // no cache "campo-tiles-v3", evitando duplicar armazenamento.
  if(isMapTile(url)) return;

  // Navegação: tenta versão nova online, mas cai no index salvo sem internet.
  if(req.mode === 'navigate'){
    event.respondWith((async()=>{
      try{
        const fresh = await fetch(req);
        if(fresh && fresh.ok){
          const cache = await caches.open(APP_CACHE);
          await cache.put('./index.html', fresh.clone());
          return fresh;
        }
      }catch(_){}
      const cache = await caches.open(APP_CACHE);
      return (await cache.match(req)) ||
             (await cache.match('./index.html')) ||
             (await cache.match('./'));
    })());
    return;
  }

  // Leaflet e demais recursos: cache primeiro, rede como atualização.
  event.respondWith((async()=>{
    const cached = await caches.match(req);
    if(cached) return cached;

    try{
      const resp = await fetch(req);
      if(resp && (resp.ok || resp.type === 'opaque')){
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(req, resp.clone());
      }
      return resp;
    }catch(e){
      // Tenta pelo URL absoluto, útil para dependências externas pré-cacheadas.
      const byUrl = await caches.match(req.url);
      if(byUrl) return byUrl;
      throw e;
    }
  })());
});
