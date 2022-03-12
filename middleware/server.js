// import fastify
const fastify = require("fastify");
// import ipfs-http-client
const ipfs = require("ipfs-http-client")

// connect to local ipfs node
const client = ipfs.create()

// create the server object
const server = fastify({ logger: true });

server.register(require('fastify-cors'), function (instance) {

  return (req, callback) => {
    let corsOptions;
    const origin = req.headers.origin
    // do not include CORS headers for requests from localhost
    const hostname = new URL(origin).hostname
    if(hostname === "localhost:3000"){
      corsOptions = { origin: false }
    } else {
      corsOptions = { origin: true }
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }
})


// post route
server.post("/", async (request, reply) => {
  const result = await client.add(JSON.stringify(request.body))
  return result.path;
});
// get route
server.get("/:path", async (request, reply) => {
  const result = await client.get(request.params.path)
console.log();
  let contents = ""
  for await(const item of result){
      // turn string buffer to string and append to contents
      contents += new TextDecoder().decode(item)
  }  // remove null characters
  contents = contents.replace(/\0/g, "")
   // trim to object
  contents = JSON.parse(contents.slice(contents.indexOf("{"),contents.indexOf("}")+1));
  return contents;
});

// start server function
const start = async () => {
  await server.listen(3001).catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });
  console.log("Listening on port 3001")
};

// turn server on
start();