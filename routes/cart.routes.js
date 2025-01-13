const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.render('cart');
});

router.post('/add/:id', (req, res) => {
   var name = req.params.id;

   if(!req.session.cart) {
      req.session.cart = {};
   }

   if(req.session.cart[name]) {
      req.session.cart[name] = req.session.cart[name] + 1;
   } else {
      req.session.cart[name] = 1;
   }

   res.sendStatus(204);
});

router.post('/remove/:id', (req, res) => {
   var name = req.params.id;
   if(req.session.cart[name]) {
      if(req.session.cart[name] > 1) {
         req.session.cart[name] -= 1;
      } else {
         delete req.session.cart[name];
      }
   } else {
      res.sendStatus(410);
   }
   res.sendStatus(204);
});

router.get('/getAll', (req, res) => {
   if(!req.session.cart) {
      req.session.cart = {};
   }

   res.status(200).json(req.session.cart);
});

//vraća ukupan broj artikala u košarici
router.get('/itemsNo', (req, res) => {
   var rez = {"no": 0};
   if(!req.session.cart) {
      res.status(200).json(rez);
   } else {
      const keys = Object.keys(req.session.cart);
      for (let key of keys) {
         rez["no"] += req.session.cart[key];
      }

      res.status(200).json(rez);
   }
});

//vraća broj primjeraka istog artikla u košarici
router.get('/articleNo/:id', (req, res) => {
   var rez = {"no": 0};
   var name = req.params.id;
   if(req.session.cart && req.session.cart[name])
      rez["no"] = req.session.cart[name];
   res.status(200).json(rez);
});

module.exports = router;