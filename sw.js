/* AXON service worker: lets the app install and open fast. Network first, cache as backup. */
var CACHE="axon-v3";
var FILES=["./","index.html","manifest.json","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){
 e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}));self.skipWaiting();
});
self.addEventListener("activate",function(e){
 e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==CACHE}).map(function(x){return caches.delete(x)}))}));
 self.clients.claim();
});
self.addEventListener("fetch",function(e){
 var r=e.request;
 if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r).then(function(res){
  var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)});return res;
 }).catch(function(){return caches.match(r)}));
});
