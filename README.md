# calculator

解决js计算浮点数的精度问题，支持+、-、*、/、%、()计算，支持科学计数法，除数为0时显示error

## 安装

```bash
$ npm install sm-calculate
```
## 测试
```bash
$ npm test
```
## 使用方法
```javascript
var calculate = require('sm-calculate');

calculator('1.2*12/(5+6)-4/(5+3)')    //  '0.809090909090909'
calculator('1.2-1.1')   //  '0.1'
calculator('3*1+11/0')  //  'Error'
calculator('123123123123*123123123123') //  '1.5159303447561418e+22'

```
