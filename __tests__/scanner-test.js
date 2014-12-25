jest.dontMock('../pos_v2_3rdlib/js/scanner');

describe('scanner',function() {
  describe('#setscanner()',function() {
    it('should return cartItem',function() {

      var Scanner = require('../pos_v2_3rdlib/js/scanner');
      var scanner = new Scanner();

      var result = scanner.setscanner('ITEM000003-2');

      var item = jest.genMockFn();
      item.mockReturnValue('ITEM000003-2');

      var cartitem = {item:{'barcode':'ITEM000003','name':'荔枝','unit':'斤','price':15}, 'count' : 2};

      expect(result).toEqual(cartitem);

    });
  });
});
