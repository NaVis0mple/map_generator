addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const kvNamespace = 'map_api'; // Replace with your KV namespace
  const apiUrl = await KV.get('map_api'); // 'mapTileApi' is the key in the KV store

  return new Response(apiUrl, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}