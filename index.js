var movePoint = require('sm-movepoint');

var trueNum = function (a) {
    var b = String(a);

    if (b.indexOf('e') !== -1) {
        var arr = b.split('e');

        return movePoint(arr[0], Number(arr[1]));
    } else {
        return b;
    }
},
accAdd = function (a, b) {
    var num1 = String(trueNum(a)).match(/\.\d+/g),
        num2 = String(trueNum(b)).match(/\.\d+/g),
        len1 = num1 ? num1[0].length : 1,
        len2 = num2 ? num2[0].length : 1,
        zeroNum = Math.max(len1, len2) - 1,
        num3 = movePoint(trueNum(a), zeroNum),
        num4 = movePoint(trueNum(b), zeroNum),
        num5 = trueNum(Number(num3) + Number(num4));

    return movePoint(String(num5), -zeroNum);
},
realSub = function (a, b) {
    var num1 = String(trueNum(a)).match(/\.\d+/g),
        num2 = String(trueNum(b)).match(/\.\d+/g),
        len1 = num1 ? num1[0].length : 1,
        len2 = num2 ? num2[0].length : 1,
        zeroNum = Math.max(len1, len2) - 1,
        num3 = movePoint(trueNum(a), zeroNum),
        num4 = movePoint(trueNum(b), zeroNum),
        num5 = trueNum(Number(num3) - Number(num4));

    return movePoint(String(num5), -zeroNum);
},

accMul = function (a, b) {
    var num1 = String(trueNum(a)).match(/\.\d+/g),
        num2 = String(trueNum(b)).match(/\.\d+/g),
        len1 = num1 ? num1[0].length : 1,
        len2 = num2 ? num2[0].length : 1,
        zeroNum = Math.max(len1, len2) - 1,
        num3 = movePoint(trueNum(a), zeroNum),
        num4 = movePoint(trueNum(b), zeroNum),
        num5 = trueNum(Number(num3) * Number(num4));

    return movePoint(String(num5), -(2 * zeroNum));
},
accDiv = function (a, b) {
    var num1 = String(trueNum(a)).match(/\.\d+/g),
        num2 = String(trueNum(b)).match(/\.\d+/g),
        len1 = num1 ? num1[0].length : 1,
        len2 = num2 ? num2[0].length : 1,
        zeroNum = Math.max(len1, len2) - 1,
        num3 = movePoint(trueNum(a), zeroNum),
        num4 = movePoint(trueNum(b), zeroNum),
        num5 = trueNum(Number(num3) / Number(num4));

    return num5;
},
candleFh = function (baseExpression) {
    // 处理e,%
    var hasEBai = baseExpression.match(/.*e[-+]\d+%?|\-?\d+\.?\d*%/g),
        num1, num2, val1, val2, val3, val4, exp;

    exp = baseExpression;
    if (hasEBai) {
        for (var i = 0; i < hasEBai.length; i++) {
            val1 = hasEBai[i];

            if (val1.indexOf('e') === -1) {
                num1 = val1.split('%')[0];
                num2 = movePoint(num1, -2);
                exp = baseExpression.replace(val1, num2);
            } else {
                val2 = val1.match(/\-?\d+\.?\d*/g)[0];
                val3 = val1.match(/\-?\d+\.?\d*/g)[1];
                val4 = movePoint(val2, Number(val3));
                if (val1.indexOf('%') !== -1) {
                    val4 = movePoint(val4, -2);
                }
                exp = baseExpression.replace(val1, val4);
            }
        }
    }
    return exp;
},
// 计算每一个括号内子表达式
calcBasic = function (baseExpression) {
    if (baseExpression === 'Error') {
        return 'Error';
    }
    var hasZeros = [], val5, val6, step, exp;

    exp = candleFh(baseExpression);
    if (exp.match(/.*e[+-]\d+%?|\-?\d+\.?\d*%/g)) {
        exp = candleFh(exp);
    }
    // 处理小数点后多余的0
    hasZeros = exp.split(/[\+\-\*\/]/g);
    for (var n = 0; n < hasZeros.length; n++) {
        val5 = hasZeros[n];
        val6 = val5.match(/\d+\.\d*[^0]+/g);
        if (val6) {
            var val7 = val6[0];

            if (val7[val7.length - 1] === '.') {
                val7 = val7.split('.')[0];
            }
            
            exp = exp.replace(val5, val7);
        }
    }
    step = (function () {
        var hasChengChu = exp.match(/(\-?\d+\.?\d*)([\*\/](\-?\d+\.?\d*))+/g),
            hasJiaJian1;

        if (hasChengChu) {
            for (var i = 0; i < hasChengChu.length; i++) {
                var val = hasChengChu[i],
                    innerFh = val.match(/[\*\/]/g),
                    innerNums = val.split(/[\*\/]/),
                    innerRes = innerNums[0];

                for (var n = 0; n < innerFh.length; n++) {
                    var fh = innerFh[n],
                        innerNum = innerNums[n + 1];

                    if (fh === '/') {
                        if (innerNum == 0) {
                            return 'Error';
                        } else {
                            innerRes = accDiv(innerRes, innerNum);
                        }
                    } else {
                        innerRes = accMul(innerRes, innerNum);
                    }
                }
                exp = exp.replace(val, innerRes);
            }
        }
        hasJiaJian1 = exp.match(/[\+\-]/);
        if (hasJiaJian1) {
            exp = exp.replace(/\+\-/g, '-');
            exp = exp.replace(/\-\-/g, '+');
            var innerFh2 = exp.match(/[\+\-]/g),
                innerNums2 = exp.split(/[\+\-]/),
                innerRes2 = innerNums2[0];

            for (var m = 0; m < innerFh2.length; m++) {
                var fh2 = innerFh2[m],
                    innerNum2 = innerNums2[m + 1];

                if (fh2 === '+') {
                    innerRes2 = accAdd(innerRes2, innerNum2);
                } else {
                    innerRes2 = realSub(innerRes2, innerNum2);
                }
            }
            exp = innerRes2;
        }
        return exp;
    })();
    step = isNaN(step) ? 'Error' : step;
    return step;
};
// 计算总的算式
module.exports = function (complexExpression) {
    var arr = complexExpression.match(/\([^)]*\)/g),
        expression = complexExpression,
        result;

    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            var val = arr[i],
                newVal = calcBasic(val.substr(1, val.length - 2));

            expression = expression.replace(val, newVal);
        }
        result = calcBasic(expression);
    } else {
        result = calcBasic(complexExpression);
    }
    result = isNaN(result) ? 'Error' : Number(result);
    return result;
};

