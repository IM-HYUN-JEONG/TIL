/**
 * @param {...(null|boolean|number|string|Array|Object)} args
 * @return {number}
 */
var argumentsLength = function(...args) {
    return args.length;  // 전달된 인수 배열의 길이를 반환
};

/**
 * argumentsLength(1, 2, 3); // 3
 */