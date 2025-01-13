const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.render('home');
});

router.get('/getProducts/:id', (req, res) => {
   const kategorije = require('./../data/mydata.js').categories;
   let id = req.params.id;
   var proizvodi;
   for(const x in kategorije) {
      if(kategorije[x].name == id) {
         proizvodi = kategorije[x].products;
      }
   }
   if(proizvodi) {
      res.status(200).json(proizvodi);
   } else {
      console.log(id);
      res.sendStatus(400);
   }
});

router.get('/getCategories', function (req, res, next) {
   const kategorije = require('./../data/mydata.js').categories;
   
   var imenaKat = [];
   for(const x in kategorije) {
      imenaKat[x] = kategorije[x].name;
   }
   res.status(200).json(imenaKat);
});

router.get('/test', (req, res) => {
   res.render('test');
});

module.exports = router;