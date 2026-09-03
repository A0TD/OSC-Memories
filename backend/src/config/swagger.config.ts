import swaggerJSDoc from "swagger-jsdoc";

const options:swaggerJSDoc.Options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OSC Memories!",
      version: "1.0.0",
      description: "A place where you will find all OSC memories!",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Local Development Server",
      },
      {
        url: "",
        description: "Production Server",
      },
    ],
  },
  apis: ["./src/**/*.ts"],
};

const specs = swaggerJSDoc(options);

export default specs;