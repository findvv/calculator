var calculator = require('../index');
var assert = require("assert")
describe('计算算式', function(){
  describe('科学计数法', function(){
    it('should', function(){
      assert.equal('1.5159303447561418e+22', calculator('123123123123*123123123123'));
    })
  })
  describe('除数为0', function(){
    it('should', function(){
      assert.equal('Error', calculator('3*1+11/0'));
    })
  })
  describe('浮点数计算', function(){
    it('should', function(){
      assert.equal('0.1', calculator('1.2-1.1'));
    })
  })
  describe('带括号的四则运算', function(){
    it('should', function(){
      assert.equal('0.809090909090909', calculator('1.2*12/(5+6)-4/(5+3)'));
    })
  })
})
