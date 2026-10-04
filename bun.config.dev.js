import index from "./src/index.html"

const server = Bun.serve({
  port: 3000,

  routes: {
    "/": index,

    "/samples/BD5000.WAV": () => {
      return new Response(
        Bun.file("./src/samples/BD5000.WAV")
      )
    },

    "/samples/MA.WAV": () => {
      return new Response(
        Bun.file("./src/samples/MA.WAV")
      )
    }
  }
})

console.log(`Listening on ${server.url}`)