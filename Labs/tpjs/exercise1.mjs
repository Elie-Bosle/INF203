"use strict";

// no recursion
export function fiboIt(n) {
    var fib_0 = 0
    var fib_1 = 1
    if (n == 0) {
        return fib_0
    }
    else if (n == 1) {
        return fib_1
    }
    else {
        for (var i = 2; i < n + 1; i++) {
            var temp = fib_1
            fib_1 = fib_1 + fib_0
            fib_0 = temp
        }
        return fib_1
    }
}

// programmed recursively
export function fibo_rec(n) {
    if (n == 0) {
        return 0
    }
    else if (n == 1) {
        return 1
    }
    else {
        return fibo_rec(n - 1) + fibo_rec(n - 2)
    }
}

// use a loop
export function fibonaArr(t) {
    var arrayOfFibo = []
    for (var i = 0; i < t.length; i++) {
        arrayOfFibo[i] = fibo_rec(t[i])
    }
    return arrayOfFibo
}

// no loop
export function fibonaMap(t) {
    var mapFibo = t.map(fibo_rec)
    return mapFibo
}
