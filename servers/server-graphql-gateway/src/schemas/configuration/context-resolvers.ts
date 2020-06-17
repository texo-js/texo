export default {
  Query: {
    configuration() {
      return {
        modules: [
          {
            name: "commerce",
            version: "1.0.0"
          }
        ],
        entryPoint: {
          module: "commerce",
          component: "shell"
        }
      }
    }
  }
}