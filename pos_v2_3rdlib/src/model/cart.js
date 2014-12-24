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
