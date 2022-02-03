const express = require('express');
const app = express();

require('dotenv').config()

const { dbConnection } = require('./database/config')
const { typeError }= require('./middlewares/errors');
const PORT = process.env.PORT

app.use(express.json())

dbConnection()

app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));

app.use(typeError);

app.listen(PORT, () => console.log(`Servidor levantado en el puerto ${PORT}`))