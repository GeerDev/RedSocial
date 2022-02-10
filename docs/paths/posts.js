module.exports = {
      get: {
          tags: {
            Posts: " Consigue posts ",
          },
          description: "Trae todos los posts",
          operationId: "getAll",
          parameters: [],
          responses: {
            200: {
              description: "Aquí tienes todos los posts",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/post",
                  },
                },
              },
            },
          },
        },
      post: {
        security: [{
          ApiKeyAuth: [ ]
        }],
        tags: {
          Posts: " Crea un Post",
        },
        description: "Crea Post",
        operationId: "create",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/postInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Post creado con éxito",
          },
          500: {
            description: "Hubo un problema a la hora de crear un Post",
          },
        },
      },   
}

  