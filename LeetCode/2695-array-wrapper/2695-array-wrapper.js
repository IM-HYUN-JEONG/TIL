/**
 * @param {number[]} nums
 * @return {void}
 */
var ArrayWrapper = function(nums) {
    this.nums = nums; // 생성자에서 숫자 배열을 저장
};

/**
 * @return {number}
 */
ArrayWrapper.prototype.valueOf = function() {
    // 더하기 연산을 위한 메서드
    // 배열 요소들의 합을 반환
    return this.nums.reduce((acc, curr) => acc + curr, 0)
}

/**
 * @return {string}
 */
ArrayWrapper.prototype.toString = function() {
    // 문자열로 변환할 때 배열을 "[1,2,3]" 형태로 반환
    return `[${this.nums.join(",")}]`;
}

/**
 * const obj1 = new ArrayWrapper([1,2]);
 * const obj2 = new ArrayWrapper([3,4]);
 * obj1 + obj2; // 10
 * String(obj1); // "[1,2]"
 * String(obj2); // "[3,4]"
 */