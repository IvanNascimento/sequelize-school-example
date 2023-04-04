const express = require('express');
const bp = require('body-parser')
const cors = require('cors');

const { db, models } = require('./models/index')
const crud = require('./routes/crud')

const app = express();

const port = process.env.PORT || 4545
const host = process.env.HOST || '0.0.0.0'

const authorization = "MySuperHyperMegaBlaster2000APIKey"

app.use(bp.json())
app.use(bp.urlencoded())
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

app.use("/student", crud(models["Student"]))
app.use("/subject/math", crud(models["Math"]))
app.use("/subject/programming", crud(models["Programming"]))

// Error handling
app.use((err, req, res, next) => {
  console.error(err)
  res
    .status(500)
    .send({
      message: "Error",
      detail: "Internal server error"
    })
})

db.authenticate()
  .then(() => {
    db.sync({ alter: true })
      .then(() => {
        console.log("Sucessfully connected to database")
        app.listen(port, host, () => {
          console.log("Server listening at port:", port)
          console.log(models);
        })
      })
      .catch(err => {
        console.error(err)
      })
  })
  .catch(e => {
    console.log(e);
  })