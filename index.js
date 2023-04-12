const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');

const { db, models } = require('./models/index')
const crud = require('./routes/crud');
const { MODELS, PORTS, HOST, SUBJECTS } = require('./config/constants');

const app = express();

const authorization = "MySuperHyperMegaBlaster2000APIKey"

// parser the body to a json object
app.use(express.json())

// Force use url encodeded
app.use(express.urlencoded({
  extended: true
}))

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}))

// Requestes rate limit
app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  message: {
    message: "Error",
    detail: "Rate limit exceeded"
  }
}))

// Authorization system
// Verify api key
app.use((req, res, next) => {
  if (req.get('Authorization') == authorization) {
    next()
  } else {
    res
      .status(403)
      .send({
        message: "Access denied",
        detail: "Authentication required"
      })
  }
})

// Route to verify if API is online 
app.get('/school', (req, res, next) => {
  res
    .status(200)
    .send({
      message: 'Success',
      details: 'Oi Meu Chapa'
    })
})

// API Routes
app.use("/school/teacher", crud(models[MODELS['Teacher']]))
app.use("/school/student", crud(models[MODELS['Student']]))
app.use("/school/subject", crud(models[MODELS['Subject']]))
app.get('/school/subjects', (req, res, next) => {
  res
    .status(200)
    .send({
      message: 'Success',
      data: SUBJECTS
    })
})

// Get 404 page not found
app.use((req, res, next) => {
  const url = req.url
  res
    .status(404)
    .send({
      message: 'Not Found',
      detail: `Url: ${url} not exist`
    })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err)
  res
    .status(500)
    .send({
      message: "Error",
      detail: err.message
    })
})

// Sync database and start server, HTTPS or HTTP
db.authenticate()
  .then(() => {
    db.sync({
      // alter: true,
      logging: false
    })
      .then(() => {
        console.log("Sucessfully connected to database")
        try {
          // HTTPS Server
          const httpscert = {
            key: fs.readFileSync('./https/privkey.pem'),
            cert: fs.readFileSync('./https/cert.pem')
          }
          https.createServer(httpscert, app).listen(PORTS.https, HOST)
          console.log(`HTTPS server listening on ${HOST}:${PORTS.https}`)
        } catch (err) {
          // HTTP Server
          app.listen(PORTS.http, HOST, () => {
            console.log(`HTTP server listening on ${HOST}:${PORTS.http}`)
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  })
  .catch(e => {
    console.log(e);
  })