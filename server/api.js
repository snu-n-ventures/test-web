const express = require('express');
const router = express.Router();
const db = require('./db');

const conn = db.init();
conn.connect();


router.route('/echo')
.get(async(request, response) => {
    try {
        console.log(new Date(), request.query);
        response.send(request.query);
    }
    catch(error) {
        handleError(request, response, error);
    }
});


module.exports = router;