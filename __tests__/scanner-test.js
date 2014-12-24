jest.dontMock('../pos_v2_3rdlib/js/scanner');

describe('scanner',function() {
  describe('#setscanner()',function() {
    it('should return cartItem',function() {

      var Scanner = require('../pos_v2_3rdlib/js/scanner');
      var scanner = new Scanner();

      var result = scanner.setscanner('ITEM000000');

      var item = jest.genMockFn();
      item.mockReturnValue('ITEM000000');

      var cartitem = {item:{'barcode':'ITEM000000','name':'可口可乐','unit':'瓶','price':3}, 'count' : 1};

      expect(result).toEqual(cartitem);

    });
  });
});
