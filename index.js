const express = require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const userRoutes = require('./src/routes/userRoutes');

const app = express()
const port = 3000

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRoutes)

app.listen(port, () => console.log(`Server listening of port ${port}`))