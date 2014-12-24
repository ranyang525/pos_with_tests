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
  return promotioncount;
  }
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
