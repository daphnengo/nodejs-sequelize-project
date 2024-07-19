const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sequelizeDb = require('./util/database');
const errorsRoutes = require('./routes/errors');
const storeRoutes = require('./routes/store');
const adminRoutes = require('./routes/admin');

const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('views', path.join(__dirname, 'views'));
// Set EJS View Engine
app.set('view engine','ejs');
// Set HTML engine
app.engine('html', require('ejs').renderFile);

// parse application/json
// app.use(bodyParser.json());
// "body-parser" module is used to parse HTTP request body
// It parses different types of payloads, such as URL-encoded data or JSON
// then populate the "req.body" object with parsed data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

// create a middleware to store user in the request
// so that we can access it anywhere in the project
// the middleware is only created after the server is connected successfully
// therefore, we only have a dummy user created below
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use(errorsRoutes);
app.use(storeRoutes);
app.use('/admin', adminRoutes);

// Sequelize relations/associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem }); // means 1 cart has many products
Product.belongsToMany(Cart, { through: CartItem }); // means a product can belong to many carts
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelizeDb
  .sync() // { force: true } overwrite database
  .then(() => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      User.create({
        name: 'Daphne',
        email: 'daphne@test.com',
      });
    }

    return Promise.resolve(user);
  })
  .then(user => {
    return user.createCart();
  })
  .then(() => {
    console.log('Connected!');
    app.listen(8000);
  })
  .catch(error => console.log(error));

