jest.dontMock('../pos_v2_3rdlib/js/cart-item.js');

describe('CartItem', function() {
  describe('#getPromotioncount', function() {

    it('should return promotioncount',function() {
      var CartItem = require('../pos_v2_3rdlib/js/cart-item.js');

      var cartItems =
    [{item:{'barcode':'ITEM000001','name':'雪碧','unit':'瓶','price':3}, 'count' : 5},
    {item:{'barcode':'ITEM000003','name':'荔枝','unit':'斤','price':15}, 'count' : '2'},
     {item:{'barcode':'ITEM000005','name':'方便面','unit':'袋','price':4.5}, 'count' : 3}];


      var result = CartItem.getPromotioncount(cartItems);
      var promotioncount =[1,0,1];



      expect(result).toEqual(promotioncount);

    });
  });
});
