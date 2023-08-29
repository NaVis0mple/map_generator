export async function onRequest(context) {
  try {
  
    // Contents of context object
      const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
      } = context;
     
    //get the ENV var for the binding 
    //note this is the variable name you added in the KV bindings in your Cloudflare pages set up.
    const KV = context.env.map_api;

    //put a variable in place. 
    KV.put("foo", "bar",{})
    
    //The following are commented out and are here an example on how to use it.

    //get a key
    //const key = await KV.get("foo")
    //console.log(key)
    
    //delete a key
    //KV.delete("foo")
    
    //list the keys
    const value = await KV.list()
    console.log(value)
  
    return new Response('boo');
} catch (err) {
    //flatten the error
    let json = JSON.stringify(err)
    //return the error
    return new Response(err);
}

}