module.exports = {
    components:{
        securitySchemes: {
            ApiKeyAuth: {
              type: "apiKey",
              name: "Authorization",
              in: "header"
            }
        },
        schemas:{
            post:{
                type:'object',
                properties:{
                    _id:{
                        type:'ObjectId',
                        description:"Número identificación del post",
                        example:"6201064b0028de7866e2b2c4"
                    },
                    title:{
                        type:'string',
                        description:"Título del post",
                        example:"Titulo post"
                    },
                    description:{
                        type:"string",
                        description:"Descripción del post",
                        example:"Descripción post"
                    },
                    image:{
                        type:'string',
                        description:"Imagen del post",
                        example:"Path de la imagen del post"
                    },
                    userId:{
                        type:'ObjectId',
                        description:"Usuario que ha hecho el post",
                        example:"6201064b0028de7866e2b2c4"
                    },
                    comments:{
                        type:"Array",
                        description:"Comentarios dentro del post, es un array de objetos",
                        example:"userId, comment, image, likes"
                    },
                    likes:{
                        type:"ObjectId",
                        description:"Likes que tiene tu post",
                        example:"6201064b0028de7866e2b2c4"
                    }
                }
            },
            postInput:{
                type:'object',
                properties:{
                    title:{
                        type:'string',
                        description:"Título del post",
                        example:"Titulo post"
                    },
                    description:{
                        type:"string",
                        description:"Descripción del post",
                        example:"Descripción post"
                    },
                    image:{
                        type:'string',
                        description:"Imagen del post",
                        example:"Path de la imagen del post"
                    }
                }
            },
            userInput:{
                type:'object',
                properties:{
                    name:{
                        type:'string',
                        description:"Nombre del usuario",
                        example:"Paquito Chocolatero"
                    },
                    email:{
                        type:"string",
                        description:"Descripción del usuario",
                        example:"soypaquitoxetu@gmail.com"
                    },
                    password:{
                        type:'string',
                        description:"Contraseña del usuario",
                        example:"TatatatataEyEyEy"
                    }
                }
            }
        }
    }
}
