function isPalindrome(x: number): boolean {
    // 음수, 10의 배수 는 탈락
    if (x<0 || (x % 10 === 0 && x !== 0)) return false;
    // 한자리 숫자는 모두 팰린드롬
    if (x<10) return true;

    let original = x;
    let reversed = 0;

    // 숫자 뒤집기 과정
    while (x>reversed) {
        const digit = x%10;
        reversed = reversed*10 + digit;
        x = Math.floor(x/10)
    }
    // 홀수 자리숫자의 경우 reversed가 x보다 하나 큰 상태일 수 있음
    return x === reversed || x === Math.floor(reversed/10);
};