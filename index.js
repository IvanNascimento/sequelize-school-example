const express = require('express');
const bp = require('body-parser')
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');

const { db, models } = require('./models/index')
const crud = require('./routes/crud');
const { MODELS, PORTS, HOST } = require('./config/constants');

const app = express();

const authorization = "MySuperHyperMegaBlaster2000APIKey"

app.use(bp.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cors())

// Authentication system
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

app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  message: 'Too many requests'
}))

app.get('/school', (req, res, next) => {
  res
    .status(200)
    .send({
      message: 'Success',
      details: 'Oi Meu Chapa'
    })
})

app.use("/school/teacher", crud(models[MODELS['Teacher']]))
app.use("/school/student", crud(models[MODELS['Student']]))
app.use("/school/subject", crud(models[MODELS['Subject']]))

app.use((req, res) => {
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
            cert: fs.readFileSync('./https/cert.pem'),
            ca: fs.readFileSync('./https/chain.pem')
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