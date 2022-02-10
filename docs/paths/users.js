module.exports = {
          post: {
            tags: {
                Users: " Crea un Usuario",
            },
            description: "Crea Usuario",
            operationId: "register",
            parameters: [],      
            requestBody: {
                content: {
                "application/json": {
                    schema: {
                    $ref: "#/components/schemas/userInput",
                    },
                },
                },
            },
            responses: {
                201: {
                description: "Usuario creado con éxito",
                },
                500: {
                description: "Hubo un problema a la hora de crear un Usuario",
                },
            },
        },
}