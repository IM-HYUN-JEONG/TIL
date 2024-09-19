/**
 * @param {Promise} promise1
 * @param {Promise} promise2
 * @return {Promise}
 */
var addTwoPromises = async function(promise1, promise2) {
    // Promise.all로 두 가지 약속이 모두 해결될 때까지 대기
    const [result1, result2] = await Promise.all([promise1, promise2]);
    // 두 결과 값을 더한 값을 반환
    return result1 + result2;
};

/**
 * addTwoPromises(Promise.resolve(2), Promise.resolve(2))
 *   .then(console.log); // 4
 */