jest.dontMock('../pos_v2_3rdlib/js/cart');
jest.dontMock('lodash');

describe('Cart',function() {
  describe('#addCartItem',function() {
    it('should return cartitems',function() {
      var Cart = require('../pos_v2_3rdlib/js/cart.js');


      var cartItem = {
        item:{'barcode':'ITEM000001','name':'雪碧','unit':'瓶','price':3}, 'count' : 1
        };

      var cart = new Cart();
      cart.addCartItem(cartItem);
      cart.addCartItem(cartItem);

      var cartItems =
      [{item:{'barcode':'ITEM000001','name':'雪碧','unit':'瓶','price':3}, 'count' : 2}];


       expect(cart.cartItems).toEqual(cartItems);


    });
  });
});
