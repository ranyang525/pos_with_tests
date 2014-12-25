jest.dontMock('../pos_v2_3rdlib/js/cart');
jest.dontMock('lodash');
jest.dontMock('../pos_v2_3rdlib/js/cart-item');

describe('Cart',function() {
  var Cart = require('../pos_v2_3rdlib/js/cart.js');
  var cart = new Cart();


  describe('#addCartItem',function() {
    it('should return cartitems',function() {


      var cartItem = {
        item:{'barcode':'ITEM000001','name':'雪碧','unit':'瓶','price':3}, 'count' : 1
        };
      var cartItem1 ={item:{'barcode':'ITEM000005','name':'方便面','unit':'袋','price':4.5}, 'count' : 1}
      var cartItem2 ={item:{'barcode':'ITEM000003','name':'荔枝','unit':'斤','price':15}, 'count' : 2}


      cart.addCartItem(cartItem);
      cart.addCartItem(cartItem);
      cart.addCartItem(cartItem);
      cart.addCartItem(cartItem);
      cart.addCartItem(cartItem);
      cart.addCartItem(cartItem2);
      cart.addCartItem(cartItem1);
      cart.addCartItem(cartItem1);
      cart.addCartItem(cartItem1);

      var cartItems =
      [
      {item:{'barcode':'ITEM000001','name':'雪碧','unit':'瓶','price':3}, 'count' : 5},
      {item:{'barcode':'ITEM000003','name':'荔枝','unit':'斤','price':15}, 'count' : 2},
      {item:{'barcode':'ITEM000005','name':'方便面','unit':'袋','price':4.5}, 'count' : 3}
       ];


       expect(cart.cartItems).toEqual(cartItems);

    });
  });
  describe('#getPromotionText',function() {
    it('should return promotionText',function() {

      cart.getPromotionText();

      var promotionText = '名称：雪碧，数量：1瓶\n' +
                          '名称：方便面，数量：1袋\n'

      expect(cart.getPromotionText()).toContain(promotionText);

    });
  });
  describe('#getCartItemsText',function() {
    it('should return cartItemText',function() {

      var CartItem = jest.genMockFn();
      CartItem.mockReturnValue(cart.cartItems);


      var result = cart.getCartItemsText();

      var cartItemText =
      '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
      '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
      '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n'

      expect(result).toContain(cartItemText);

    })
  });
  
  describe('#getSummaryText',function() {
    it('should return summaryText',function() {

      var result = cart.getSummaryText();

      var CartItem = jest.genMockFn();
      CartItem.mockReturnValue(cart.cartItems);

      var summaryText =
      '总计：51.00(元)\n' +
      '节省：7.50(元)\n';

      expect(result).toContain(summaryText);


    });
  });

});
