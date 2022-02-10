const express = require('express');
const app = express();
const swaggerUI = require('swagger-ui-express')
const docs = require('./docs/index')

require('dotenv').config()

const { dbConnection } = require('./database/config')
const { typeError }= require('./middlewares/errors');

const PORT = process.env.PORT

app.use(express.json())

dbConnection()

app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));

app.use(typeError)

app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(docs))

app.listen(PORT, () => console.log(`Servidor levantado en el puerto ${PORT}`))