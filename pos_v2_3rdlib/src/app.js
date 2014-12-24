(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/cart-item.js":[function(require,module,exports){
var Promotion = require('./promotion');

function CartItem(item,count) {
  this.item = item;
  this.count = count || 0;
}

CartItem.getPromotioncount = function(cartItems) {
  var promotions = Promotion.loadPromotions();
  var promotioncount = [];

  for(var i = 0; i < cartItems.length; i++) {

    CartItem.findPromotioncount(promotions[0], cartItems[i], promotioncount);
  }
  return promotioncount;
};

CartItem.findPromotioncount = function(promotion, cartItem, promotioncount) {
  for(var j = 0; j < promotion.barcodes.length; j++) {

    if(cartItem.item.barcode === promotion.barcodes[j]) {
      promotioncount.push(0);
    } else {
      promotioncount.push(Math.floor(cartItem.count/3));
    }
  }
  return promotioncount;
};

module.exports = CartItem;

},{"./promotion":"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/promotion.js"}],"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/cart.js":[function(require,module,exports){
var Promotion = require('./promotion');

function Cart() {
  this.cartItems = [];
}

Cart.prototype.addCartItem = function(oneCartItem) {
  var cartItems = this.cartItems;
  var cartItem = _.find(cartItems, function(cartItem) {
    return cartItem.item.barcode === oneCartItem.item.barcode;
  });
  if (cartItem) {
    cartItem.count += oneCartItem.count;
  } else {
    cartItems.push(oneCartItem);
  }
};

Cart.prototype.getCartItems = function() {
  return this.cartItems;
};

Cart.prototype.getPromotionText = function() {

  var promotions = Promotion.loadPromotions();
  var promotionText = '';

  for(var i = 0; i < this.cartItems.length; i++) {
    promotionText += findPromotion(this.cartItems[i], promotions);

  }
  return promotionText;
};

function findPromotion(cartItem, promotions) {
  var promotionText = '';
  for(var j = 0; j < promotions[0].barcodes.length; j++) {

    if(cartItem.item.barcode === promotions[0].barcodes[j]) {
      promotionText += '名称：' + cartItem.item.name +
      '，数量：' + Math.floor(cartItem.count/3) + cartItem.item.unit + '\n';
    }
  }
  return promotionText;
}

Cart.prototype.getCartItemsText = function() {

  var promotioncount = CartItem.getPromotioncount(this.cartItems);
  var cartItemText = '';

  _.forEach(this.cartItems,function(cartItem, index) {
    var item = cartItem.item;
    var actual = cartItem.count - promotioncount[index];

    cartItemText += '名称：' + item.name +
    '，数量：' + cartItem.count +item.unit +
    '，单价：' + item.price.toFixed(2) + '(元)' +
    '，小计：' + (item.price * actual).toFixed(2) +'(元)\n';

  });
  return cartItemText;
};

Cart.prototype.getSummaryText = function() {

  var summaryText = '';

  for(var i = 0; i < this.cartItems.length; i++) {
    summaryText = '总计：' + this.getTotal().toFixed(2) + '(元)\n' +
    '节省：' + (this.getpromotions() - this.getTotal()).toFixed(2) + '(元)\n';
  }
  return summaryText;
};

Cart.prototype.getTotal = function() {

  var total = 0 ;
  var promotioncount = CartItem.getPromotioncount(this.cartItems);

  for(var i = 0; i < this.cartItems.length; i++) {
    total += this.cartItems[i].item.price * (this.cartItems[i].count -promotioncount[i]);
  }
  return total;
};

Cart.prototype.getpromotions = function() {

  var promotions = 0 ;
  for(var i = 0; i < this.cartItems.length; i++) {
    promotions += this.cartItems[i].item.price * this.cartItems[i].count;
  }
  return promotions;
};

module.exports = Cart;

},{"./promotion":"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/promotion.js"}],"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/inventory.js":[function(require,module,exports){
function Inventory() {

}

Inventory.prototype.toString = function(cart) {
  dateDigitToString = function (num) {
    return num < 10 ? '0' + num : num;
  };
  var currentDate = new Date(),
  year = dateDigitToString(currentDate.getFullYear()),
  month = dateDigitToString(currentDate.getMonth() + 1),
  date = dateDigitToString(currentDate.getDate()),
  hour = dateDigitToString(currentDate.getHours()),
  minute = dateDigitToString(currentDate.getMinutes()),
  second = dateDigitToString(currentDate.getSeconds()),
  formattedDateString = year + '年' + month + '月' + date + '日 ' + hour + ':' + minute + ':' + second;

  return  '***<没钱赚商店>购物清单***\n' +
          '打印时间：' + formattedDateString + '\n' +
          '----------------------\n' +  cart.getCartItemsText() +
          '----------------------\n' + '挥泪赠送商品：\n' +cart.getPromotionText() +
          '----------------------\n' + cart.getSummaryText() +
          '**********************';
};

module.exports = Inventory;

},{}],"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/item.js":[function(require,module,exports){
function Item(barcode, name, unit, price) {
    this.barcode = barcode;
    this.name = name;
    this.unit = unit;
    this.price = price || 0.00;
}

Item.loadAllItems = function() {
  return [
  new Item('ITEM000000', '可口可乐', '瓶', 3.00),
  new Item('ITEM000001', '雪碧', '瓶', 3.00),
  new Item('ITEM000002', '苹果', '斤', 5.50),
  new Item('ITEM000003', '荔枝', '斤', 15.00),
  new Item('ITEM000004', '电池', '个', 2.00),
  new Item('ITEM000005', '方便面', '袋', 4.50)
  ];
};

module.exports = Item;

},{}],"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/main.js":[function(require,module,exports){
var Cart = require('./cart.js');
var Scanner = require('./scanner.js');
var Inventory = require('./inventory.js');

function printInventory(tags) {

  var scanner = new Scanner();
  var cart = new Cart();

  _.forEach(tags, function(tag) {
    cart.addCartItem(scanner.setscanner(tag));
  });

  var inventory = new Inventory();
  console.log(inventory.toString(cart));
}

},{"./cart.js":"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/cart.js","./inventory.js":"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/inventory.js","./scanner.js":"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/scanner.js"}],"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/promotion.js":[function(require,module,exports){
function Promotion(type,barcodes) {
    this.type = type;
    this.barcodes = barcodes || [];
}

Promotion.loadPromotions = function() {
  return [
  new Promotion('BUY_TWO_GET_ONE_FREE', [
  'ITEM000000',
  'ITEM000001',
  'ITEM000005'
  ])
  ];
};

module.exports = Promotion;

},{}],"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/scanner.js":[function(require,module,exports){
var CartItem = require('./cart-item');
var Item = require('./item');

function Scanner() {
}

Scanner.prototype.setscanner = function(tag) {
  var items = Item.loadAllItems();
    var tagArray = tag.split('-');
    var barcode = tagArray[0];
    var count = 1;
    if(tagArray[1]) {
      count = parseFloat(tagArray[1]);
    }
    var item = _.find(items,{barcode : barcode});
    var cartItem = new CartItem(item, count);
    return cartItem;
};

module.exports = Scanner;

},{"./cart-item":"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/cart-item.js","./item":"/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/item.js"}]},{},["/home/ranyang/Projects/pos_with_tests/pos_v2_3rdlib/src/model/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjAuMTAuMzUvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwicG9zX3YyXzNyZGxpYi9zcmMvbW9kZWwvY2FydC1pdGVtLmpzIiwicG9zX3YyXzNyZGxpYi9zcmMvbW9kZWwvY2FydC5qcyIsInBvc192Ml8zcmRsaWIvc3JjL21vZGVsL2ludmVudG9yeS5qcyIsInBvc192Ml8zcmRsaWIvc3JjL21vZGVsL2l0ZW0uanMiLCJwb3NfdjJfM3JkbGliL3NyYy9tb2RlbC9tYWluLmpzIiwicG9zX3YyXzNyZGxpYi9zcmMvbW9kZWwvcHJvbW90aW9uLmpzIiwicG9zX3YyXzNyZGxpYi9zcmMvbW9kZWwvc2Nhbm5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUHJvbW90aW9uID0gcmVxdWlyZSgnLi9wcm9tb3Rpb24nKTtcblxuZnVuY3Rpb24gQ2FydEl0ZW0oaXRlbSxjb3VudCkge1xuICB0aGlzLml0ZW0gPSBpdGVtO1xuICB0aGlzLmNvdW50ID0gY291bnQgfHwgMDtcbn1cblxuQ2FydEl0ZW0uZ2V0UHJvbW90aW9uY291bnQgPSBmdW5jdGlvbihjYXJ0SXRlbXMpIHtcbiAgdmFyIHByb21vdGlvbnMgPSBQcm9tb3Rpb24ubG9hZFByb21vdGlvbnMoKTtcbiAgdmFyIHByb21vdGlvbmNvdW50ID0gW107XG5cbiAgZm9yKHZhciBpID0gMDsgaSA8IGNhcnRJdGVtcy5sZW5ndGg7IGkrKykge1xuXG4gICAgQ2FydEl0ZW0uZmluZFByb21vdGlvbmNvdW50KHByb21vdGlvbnNbMF0sIGNhcnRJdGVtc1tpXSwgcHJvbW90aW9uY291bnQpO1xuICB9XG4gIHJldHVybiBwcm9tb3Rpb25jb3VudDtcbn07XG5cbkNhcnRJdGVtLmZpbmRQcm9tb3Rpb25jb3VudCA9IGZ1bmN0aW9uKHByb21vdGlvbiwgY2FydEl0ZW0sIHByb21vdGlvbmNvdW50KSB7XG4gIGZvcih2YXIgaiA9IDA7IGogPCBwcm9tb3Rpb24uYmFyY29kZXMubGVuZ3RoOyBqKyspIHtcblxuICAgIGlmKGNhcnRJdGVtLml0ZW0uYmFyY29kZSA9PT0gcHJvbW90aW9uLmJhcmNvZGVzW2pdKSB7XG4gICAgICBwcm9tb3Rpb25jb3VudC5wdXNoKDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9tb3Rpb25jb3VudC5wdXNoKE1hdGguZmxvb3IoY2FydEl0ZW0uY291bnQvMykpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcHJvbW90aW9uY291bnQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhcnRJdGVtO1xuIiwidmFyIFByb21vdGlvbiA9IHJlcXVpcmUoJy4vcHJvbW90aW9uJyk7XG5cbmZ1bmN0aW9uIENhcnQoKSB7XG4gIHRoaXMuY2FydEl0ZW1zID0gW107XG59XG5cbkNhcnQucHJvdG90eXBlLmFkZENhcnRJdGVtID0gZnVuY3Rpb24ob25lQ2FydEl0ZW0pIHtcbiAgdmFyIGNhcnRJdGVtcyA9IHRoaXMuY2FydEl0ZW1zO1xuICB2YXIgY2FydEl0ZW0gPSBfLmZpbmQoY2FydEl0ZW1zLCBmdW5jdGlvbihjYXJ0SXRlbSkge1xuICAgIHJldHVybiBjYXJ0SXRlbS5pdGVtLmJhcmNvZGUgPT09IG9uZUNhcnRJdGVtLml0ZW0uYmFyY29kZTtcbiAgfSk7XG4gIGlmIChjYXJ0SXRlbSkge1xuICAgIGNhcnRJdGVtLmNvdW50ICs9IG9uZUNhcnRJdGVtLmNvdW50O1xuICB9IGVsc2Uge1xuICAgIGNhcnRJdGVtcy5wdXNoKG9uZUNhcnRJdGVtKTtcbiAgfVxufTtcblxuQ2FydC5wcm90b3R5cGUuZ2V0Q2FydEl0ZW1zID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmNhcnRJdGVtcztcbn07XG5cbkNhcnQucHJvdG90eXBlLmdldFByb21vdGlvblRleHQgPSBmdW5jdGlvbigpIHtcblxuICB2YXIgcHJvbW90aW9ucyA9IFByb21vdGlvbi5sb2FkUHJvbW90aW9ucygpO1xuICB2YXIgcHJvbW90aW9uVGV4dCA9ICcnO1xuXG4gIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmNhcnRJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgIHByb21vdGlvblRleHQgKz0gZmluZFByb21vdGlvbih0aGlzLmNhcnRJdGVtc1tpXSwgcHJvbW90aW9ucyk7XG5cbiAgfVxuICByZXR1cm4gcHJvbW90aW9uVGV4dDtcbn07XG5cbmZ1bmN0aW9uIGZpbmRQcm9tb3Rpb24oY2FydEl0ZW0sIHByb21vdGlvbnMpIHtcbiAgdmFyIHByb21vdGlvblRleHQgPSAnJztcbiAgZm9yKHZhciBqID0gMDsgaiA8IHByb21vdGlvbnNbMF0uYmFyY29kZXMubGVuZ3RoOyBqKyspIHtcblxuICAgIGlmKGNhcnRJdGVtLml0ZW0uYmFyY29kZSA9PT0gcHJvbW90aW9uc1swXS5iYXJjb2Rlc1tqXSkge1xuICAgICAgcHJvbW90aW9uVGV4dCArPSAn5ZCN56ew77yaJyArIGNhcnRJdGVtLml0ZW0ubmFtZSArXG4gICAgICAn77yM5pWw6YeP77yaJyArIE1hdGguZmxvb3IoY2FydEl0ZW0uY291bnQvMykgKyBjYXJ0SXRlbS5pdGVtLnVuaXQgKyAnXFxuJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByb21vdGlvblRleHQ7XG59XG5cbkNhcnQucHJvdG90eXBlLmdldENhcnRJdGVtc1RleHQgPSBmdW5jdGlvbigpIHtcblxuICB2YXIgcHJvbW90aW9uY291bnQgPSBDYXJ0SXRlbS5nZXRQcm9tb3Rpb25jb3VudCh0aGlzLmNhcnRJdGVtcyk7XG4gIHZhciBjYXJ0SXRlbVRleHQgPSAnJztcblxuICBfLmZvckVhY2godGhpcy5jYXJ0SXRlbXMsZnVuY3Rpb24oY2FydEl0ZW0sIGluZGV4KSB7XG4gICAgdmFyIGl0ZW0gPSBjYXJ0SXRlbS5pdGVtO1xuICAgIHZhciBhY3R1YWwgPSBjYXJ0SXRlbS5jb3VudCAtIHByb21vdGlvbmNvdW50W2luZGV4XTtcblxuICAgIGNhcnRJdGVtVGV4dCArPSAn5ZCN56ew77yaJyArIGl0ZW0ubmFtZSArXG4gICAgJ++8jOaVsOmHj++8micgKyBjYXJ0SXRlbS5jb3VudCAraXRlbS51bml0ICtcbiAgICAn77yM5Y2V5Lu377yaJyArIGl0ZW0ucHJpY2UudG9GaXhlZCgyKSArICco5YWDKScgK1xuICAgICfvvIzlsI/orqHvvJonICsgKGl0ZW0ucHJpY2UgKiBhY3R1YWwpLnRvRml4ZWQoMikgKyco5YWDKVxcbic7XG5cbiAgfSk7XG4gIHJldHVybiBjYXJ0SXRlbVRleHQ7XG59O1xuXG5DYXJ0LnByb3RvdHlwZS5nZXRTdW1tYXJ5VGV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gIHZhciBzdW1tYXJ5VGV4dCA9ICcnO1xuXG4gIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmNhcnRJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgIHN1bW1hcnlUZXh0ID0gJ+aAu+iuoe+8micgKyB0aGlzLmdldFRvdGFsKCkudG9GaXhlZCgyKSArICco5YWDKVxcbicgK1xuICAgICfoioLnnIHvvJonICsgKHRoaXMuZ2V0cHJvbW90aW9ucygpIC0gdGhpcy5nZXRUb3RhbCgpKS50b0ZpeGVkKDIpICsgJyjlhYMpXFxuJztcbiAgfVxuICByZXR1cm4gc3VtbWFyeVRleHQ7XG59O1xuXG5DYXJ0LnByb3RvdHlwZS5nZXRUb3RhbCA9IGZ1bmN0aW9uKCkge1xuXG4gIHZhciB0b3RhbCA9IDAgO1xuICB2YXIgcHJvbW90aW9uY291bnQgPSBDYXJ0SXRlbS5nZXRQcm9tb3Rpb25jb3VudCh0aGlzLmNhcnRJdGVtcyk7XG5cbiAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuY2FydEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgdG90YWwgKz0gdGhpcy5jYXJ0SXRlbXNbaV0uaXRlbS5wcmljZSAqICh0aGlzLmNhcnRJdGVtc1tpXS5jb3VudCAtcHJvbW90aW9uY291bnRbaV0pO1xuICB9XG4gIHJldHVybiB0b3RhbDtcbn07XG5cbkNhcnQucHJvdG90eXBlLmdldHByb21vdGlvbnMgPSBmdW5jdGlvbigpIHtcblxuICB2YXIgcHJvbW90aW9ucyA9IDAgO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5jYXJ0SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICBwcm9tb3Rpb25zICs9IHRoaXMuY2FydEl0ZW1zW2ldLml0ZW0ucHJpY2UgKiB0aGlzLmNhcnRJdGVtc1tpXS5jb3VudDtcbiAgfVxuICByZXR1cm4gcHJvbW90aW9ucztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FydDtcbiIsImZ1bmN0aW9uIEludmVudG9yeSgpIHtcblxufVxuXG5JbnZlbnRvcnkucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oY2FydCkge1xuICBkYXRlRGlnaXRUb1N0cmluZyA9IGZ1bmN0aW9uIChudW0pIHtcbiAgICByZXR1cm4gbnVtIDwgMTAgPyAnMCcgKyBudW0gOiBudW07XG4gIH07XG4gIHZhciBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCksXG4gIHllYXIgPSBkYXRlRGlnaXRUb1N0cmluZyhjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpKSxcbiAgbW9udGggPSBkYXRlRGlnaXRUb1N0cmluZyhjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSksXG4gIGRhdGUgPSBkYXRlRGlnaXRUb1N0cmluZyhjdXJyZW50RGF0ZS5nZXREYXRlKCkpLFxuICBob3VyID0gZGF0ZURpZ2l0VG9TdHJpbmcoY3VycmVudERhdGUuZ2V0SG91cnMoKSksXG4gIG1pbnV0ZSA9IGRhdGVEaWdpdFRvU3RyaW5nKGN1cnJlbnREYXRlLmdldE1pbnV0ZXMoKSksXG4gIHNlY29uZCA9IGRhdGVEaWdpdFRvU3RyaW5nKGN1cnJlbnREYXRlLmdldFNlY29uZHMoKSksXG4gIGZvcm1hdHRlZERhdGVTdHJpbmcgPSB5ZWFyICsgJ+W5tCcgKyBtb250aCArICfmnIgnICsgZGF0ZSArICfml6UgJyArIGhvdXIgKyAnOicgKyBtaW51dGUgKyAnOicgKyBzZWNvbmQ7XG5cbiAgcmV0dXJuICAnKioqPOayoemSsei1muWVhuW6lz7otK3nianmuIXljZUqKipcXG4nICtcbiAgICAgICAgICAn5omT5Y2w5pe26Ze077yaJyArIGZvcm1hdHRlZERhdGVTdHJpbmcgKyAnXFxuJyArXG4gICAgICAgICAgJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG4nICsgIGNhcnQuZ2V0Q2FydEl0ZW1zVGV4dCgpICtcbiAgICAgICAgICAnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcbicgKyAn5oyl5rOq6LWg6YCB5ZWG5ZOB77yaXFxuJyArY2FydC5nZXRQcm9tb3Rpb25UZXh0KCkgK1xuICAgICAgICAgICctLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuJyArIGNhcnQuZ2V0U3VtbWFyeVRleHQoKSArXG4gICAgICAgICAgJyoqKioqKioqKioqKioqKioqKioqKionO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnk7XG4iLCJmdW5jdGlvbiBJdGVtKGJhcmNvZGUsIG5hbWUsIHVuaXQsIHByaWNlKSB7XG4gICAgdGhpcy5iYXJjb2RlID0gYmFyY29kZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudW5pdCA9IHVuaXQ7XG4gICAgdGhpcy5wcmljZSA9IHByaWNlIHx8IDAuMDA7XG59XG5cbkl0ZW0ubG9hZEFsbEl0ZW1zID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXG4gIG5ldyBJdGVtKCdJVEVNMDAwMDAwJywgJ+WPr+WPo+WPr+S5kCcsICfnk7YnLCAzLjAwKSxcbiAgbmV3IEl0ZW0oJ0lURU0wMDAwMDEnLCAn6Zuq56KnJywgJ+eTticsIDMuMDApLFxuICBuZXcgSXRlbSgnSVRFTTAwMDAwMicsICfoi7nmnpwnLCAn5pakJywgNS41MCksXG4gIG5ldyBJdGVtKCdJVEVNMDAwMDAzJywgJ+iNlOaenScsICfmlqQnLCAxNS4wMCksXG4gIG5ldyBJdGVtKCdJVEVNMDAwMDA0JywgJ+eUteaxoCcsICfkuKonLCAyLjAwKSxcbiAgbmV3IEl0ZW0oJ0lURU0wMDAwMDUnLCAn5pa55L6/6Z2iJywgJ+iiiycsIDQuNTApXG4gIF07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEl0ZW07XG4iLCJ2YXIgQ2FydCA9IHJlcXVpcmUoJy4vY2FydC5qcycpO1xudmFyIFNjYW5uZXIgPSByZXF1aXJlKCcuL3NjYW5uZXIuanMnKTtcbnZhciBJbnZlbnRvcnkgPSByZXF1aXJlKCcuL2ludmVudG9yeS5qcycpO1xuXG5mdW5jdGlvbiBwcmludEludmVudG9yeSh0YWdzKSB7XG5cbiAgdmFyIHNjYW5uZXIgPSBuZXcgU2Nhbm5lcigpO1xuICB2YXIgY2FydCA9IG5ldyBDYXJ0KCk7XG5cbiAgXy5mb3JFYWNoKHRhZ3MsIGZ1bmN0aW9uKHRhZykge1xuICAgIGNhcnQuYWRkQ2FydEl0ZW0oc2Nhbm5lci5zZXRzY2FubmVyKHRhZykpO1xuICB9KTtcblxuICB2YXIgaW52ZW50b3J5ID0gbmV3IEludmVudG9yeSgpO1xuICBjb25zb2xlLmxvZyhpbnZlbnRvcnkudG9TdHJpbmcoY2FydCkpO1xufVxuIiwiZnVuY3Rpb24gUHJvbW90aW9uKHR5cGUsYmFyY29kZXMpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuYmFyY29kZXMgPSBiYXJjb2RlcyB8fCBbXTtcbn1cblxuUHJvbW90aW9uLmxvYWRQcm9tb3Rpb25zID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXG4gIG5ldyBQcm9tb3Rpb24oJ0JVWV9UV09fR0VUX09ORV9GUkVFJywgW1xuICAnSVRFTTAwMDAwMCcsXG4gICdJVEVNMDAwMDAxJyxcbiAgJ0lURU0wMDAwMDUnXG4gIF0pXG4gIF07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21vdGlvbjtcbiIsInZhciBDYXJ0SXRlbSA9IHJlcXVpcmUoJy4vY2FydC1pdGVtJyk7XG52YXIgSXRlbSA9IHJlcXVpcmUoJy4vaXRlbScpO1xuXG5mdW5jdGlvbiBTY2FubmVyKCkge1xufVxuXG5TY2FubmVyLnByb3RvdHlwZS5zZXRzY2FubmVyID0gZnVuY3Rpb24odGFnKSB7XG4gIHZhciBpdGVtcyA9IEl0ZW0ubG9hZEFsbEl0ZW1zKCk7XG4gICAgdmFyIHRhZ0FycmF5ID0gdGFnLnNwbGl0KCctJyk7XG4gICAgdmFyIGJhcmNvZGUgPSB0YWdBcnJheVswXTtcbiAgICB2YXIgY291bnQgPSAxO1xuICAgIGlmKHRhZ0FycmF5WzFdKSB7XG4gICAgICBjb3VudCA9IHBhcnNlRmxvYXQodGFnQXJyYXlbMV0pO1xuICAgIH1cbiAgICB2YXIgaXRlbSA9IF8uZmluZChpdGVtcyx7YmFyY29kZSA6IGJhcmNvZGV9KTtcbiAgICB2YXIgY2FydEl0ZW0gPSBuZXcgQ2FydEl0ZW0oaXRlbSwgY291bnQpO1xuICAgIHJldHVybiBjYXJ0SXRlbTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2Nhbm5lcjtcbiJdfQ==
