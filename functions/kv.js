export async function onRequest(context) {
  const task = await context.env.map_api.get("map_api");
  return new Response(task);
}