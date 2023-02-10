const express = require('express');

module.exports = (model) => {
  let router = express.Router()

  router.get('/all', (req, res, next) => {
    let filter = {}
    req.query.include == 'all' ? filter.include = { all: true } : filter.include = req.query.include
    req.query.limit ? req.query.limit == '-1' ? undefined : filter.limit = parseInt(req.query.limit) : filter.limit = 100
    req.query.offset ? filter.offset = parseInt(req.query.offset) : undefined
    model
      .findAll(filter)
      .then(results => {
        res
          .status(200)
          .send({
            message: "Success",
            data: {
              results,
              limit: filter.limit ? filter.limit : "-1",
              offset: filter.offset ? filter.offset : 0
            }
          })
      })
      .catch(err => {
        console.log(err)
        res
          .status(404)
          .send({
            message: "Error",
            error: err.message
          })
      })
  })

  router.get('/one', (req, res, next) => {
    let filter = {
      where: {}
    }
    for (let o of Object.keys(req.query)) {
      if (o !== 'include') {
        filter.where[o] = req.query[o]
      } else {
        req.query[o] == "all" ? filter.include = { all: true } : filter.include = req.query[o]
      }
    }

    model
      .findOne(filter)
      .then(result => {
        res
          .status(200)
          .send({
            message: "Success",
            data: result
          })
      })
      .catch(err => {
        console.log(err)
        res
          .status(404)
          .send({
            message: "Error",
            error: err.message
          })
      })
  })

  router.post('/', (req, res, next) => {
    model
      .create(req.body)
      .then(result => {
        res
          .status(201)
          .send({
            message: "Success",
            data: result
          })
      })
      .catch(err => {
        console.log(err)
        res
          .status(422)
          .send({
            message: "Error",
            error: err.message
          })
      })
  })

  router.put('/:id', (req, res, next) => {
    model
      .update(req.body, {
        where: {
          id: req.params.id
        }
      })
      .then(result => {
        res
          .status(200)
          .send({
            message: "Success",
            data: result
          })
      })
      .catch(err => {
        console.log(err)
        res
          .status(400)
          .send({
            message: "Error",
            error: err.message
          })
      })
  })

  router.delete('/:id', (req, res, next) => {
    model
      .destroy({
        where: {
          id: req.params.id
        }
      })
      .then(result => {
        res
          .status(204)
          .send()

      })
      .catch(err => {
        console.log(err)
        res
          .status(400)
          .send({
            message: "Error",
            error: err.message
          })
      })
  })

  return router
}