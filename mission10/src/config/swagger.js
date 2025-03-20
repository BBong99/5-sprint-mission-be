import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Panda Market API",
      version: "1.0.0",
      description: "중고마켓 서비스 API 문서",
    },
    servers: [
      {
        url: process.env.API_URL,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/**/controller.js", "./src/**/model.js", "./server.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
