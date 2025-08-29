// routes/visitorRoutes.js
const express = require('express');
const Visitor = require('../models/visitors.js');
const router = express.Router();

router.get('/count', async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ count: 1 });
    } else {
      visitor.count += 1;
    }
    await visitor.save();
    res.json({ count: visitor.count });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
