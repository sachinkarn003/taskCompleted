const express = require('express');
const anagramController = require('../controller/anagramController');
const router = express.Router();

router.route('/').post(anagramController.anagram);
module.exports = router;