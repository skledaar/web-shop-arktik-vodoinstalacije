const express = require('express');
const app = express();
const path = require('path');

const session = require('express-session');
app.use(session({
   secret: 'secret',
   resave: false,
   saveUninitialized: true
}));

const homeRouter = require('./routes/home.routes');
const cartRouter = require('./routes/cart.routes');

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/cart', cartRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));