var Cart = require('./cart');
var Scanner = require('./scanner');
var Inventory = require('./inventory');
var _ = require('lodash');

function printInventory(tags) {

  var scanner = new Scanner();
  var cart = new Cart();

  _.forEach(tags, function(tag) {
    cart.addCartItem(scanner.setscanner(tag));
  });

  var inventory = new Inventory();
  console.log(inventory.toString(cart));
}

exports.printInventory = printInventory;
