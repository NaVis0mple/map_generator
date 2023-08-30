export async function onRequest(context) {
  const task = await context.env.map_api.get("thunderforest");
  return new Response(task);
}