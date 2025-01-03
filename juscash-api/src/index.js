const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swaggerConfig')
const userRoutes = require('./routes/userRoutes')
const publicationRoutes = require('./routes/publicationRoutes')
const cors = require('cors')

const app = express()
const port = 5000

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
}));

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRoutes)
app.use('/api/publications', publicationRoutes)

app.listen(port, () => console.log(`Server listening of port ${port}`))