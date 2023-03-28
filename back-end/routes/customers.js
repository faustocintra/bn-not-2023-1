const express = require('express')
const router = express.Router()
const controller = require('../controllers/customer')

router.post('/', controller.create)

module.exports = router