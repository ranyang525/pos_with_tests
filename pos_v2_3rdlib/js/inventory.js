var Cart = require('./cart');

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
