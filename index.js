const express = require('express');
const bp = require('body-parser')
const cors = require('cors');

const db = require('./models/index')
const crud = require('./routes/crud')

const app = express();

const port = process.env.PORT || 4545
const host = process.env.HOST || '0.0.0.0'

app.use(bp.json())
app.use(bp.urlencoded())
app.use(cors())

const authenticated = true

// Authentication system
app.use((req, res, next) => {
  if (authenticated) {
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

app.use("/student", crud(db.sequelize.models["Student"]))
app.use("/subject/math", crud(db.sequelize.models["Math"]))
app.use("/subject/programming", crud(db.sequelize.models["Programming"]))

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

db.sequelize.sync()
  .then(() => {
    console.log("Sucessfully connected to database")
    app.listen(port, host, () => {
      console.log("Server listening at port:", port)
    })
  })
  .catch(err => {
    console.error(err)
  })