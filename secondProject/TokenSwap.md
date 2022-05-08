# Token Swap

<hr />

## 1. UniswapV2Factory컨트랙트 컴파일 및 배포

Uniswap 공식 문서에 의하면, 현재 Uniswap은 이를 address[0]으로 두고 있다.
\_feeToSetter에 0x0000000000000000000000000000000000000000을 넣고 Deploy를 누르면 metaMask에 연동되어 가스비 확인을 눌러준다.

<hr />

## 2. Token컨트랙트 컴파일 및 배포

유동성 풀에 공급하기 위해 필요한 토큰을 발행

<hr />

## 3. UniswapV2Router02 컨트랙트 컴파일 및 배포

배포하기 위해서는 배포 Factory주소와 WETH 주소가 필요
Depolyed Contracts에 배포되어있는 UniswapV2Factory와 WETH9의 주소를 복사해서 넣어주고 transact을 누른다.
[WETH주소](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code)

<hr />

## 4. Router 컨트랙트에게 토큰을 사용할 권한을 approve

배포한 Token컨트랙트에서 Router컨트랙트를 approve
spender에 배포된 Router 주소를, amount에는 발행한 HJB와 HJE의 발행량을 넣어준다.

<hr />

## 5. Router컨트랙트에서 addLiquidity함수

addLiquidity 함수 인자

- tokenA, tokenB : 배포한 Token 컨트랙 주소
- amountADesired, amountBDesired : 유동성 풀에 넣을 토큰의 양
- amountAMin, amountBMin : 유동성 풀에 넣을 토큰의 최소 양
- to : 유동성 토큰을 받을 주소(현재 account로 설정된 계정 주소)
- deadline : 거래 유효 기간

tokenA,B 에는 각각 배포한 HJE,HJB 컨트랙트 주소를 넣고, amountADesired, amountBDesired에는 각각 totalSupply/2 를 넣어주었습니다.
amountAMin, amountBMin은 첫 유동성 공급에는 신경쓰지 않아도 되므로 0을 넣었습니다.
to에는 현재 Account로 설정되어 있는 계정 주소를 넣어주겠습니다.
마지막으로 deadline은 timestemp로 현재시간 +20분 을 구한후 넣어주었다.

<hr />

## 6.swapExactTokenForTokens

유동성 풀에 제공된 토큰을 가지고 거래(swap)을 해보겠습니다. 배포된 Router 컨트랙트에서 swapExactTokenForTokens함수를 연다

swapExactTokenForTokens 인자

- amountIn : 거래 시 넣을(input) 토큰의 양
- amountOutMin : 거래 시 받을(output) 토큰의 최소 양
- path : 거래할 토큰들의 주소를 배열 형태로 넣어주어야 한다 ( ["주소" , "주소"] )
- to : 거래 후 토큰을 받을 계정 주소(현재 account로 설정된 계정 주소)
- deadline : 거래 유효 기간

<hr />
