addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
export async function onRequest(request) {
  const task = await map_api.get("map_api"); // Replace NAMESPACE with your actual KV namespace
  return new Response(task);
}