function twoSum(nums: number[], target: number): number[] {
  // 배열의 길이만큼 반복
  for (let i = 0; i < nums.length; i++) {
    // i번째 숫자와 다른 숫자들을 비교
    for (let j = i + 1; j < nums.length; j++) {
      // 두 숫자의 합이 목표값과 같은지 확인
      if (nums[i] + nums[j] === target) {
        // 목표값을 만드는 두 숫자의 인덱스를 반환
        return [i, j];
      }
    }
  }
  
  // 목표값을 만드는 쌍이 없으면 빈 배열 반환
  return [];
}