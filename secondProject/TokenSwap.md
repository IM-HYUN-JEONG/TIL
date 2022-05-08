# Token Swap

<hr />

## 1. UniswapV2Factory컨트랙트 컴파일 및 배포

Uniswap 공식 문서에 의하면, 현재 Uniswap은 이를 address[0]으로 두고 있다.
\_feeToSetter에 0x0000000000000000000000000000000000000000을 넣고 Deploy를 누르면 metaMask에 연동되어 가스비 확인을 눌러준다.

<img width="978" alt="1 Factory컴파일(1)" src="https://user-images.githubusercontent.com/95120267/167282115-303cb4f9-23c6-4f2e-adc1-c1e54066415d.png">


블록에 생성된 결과 콘솔
<img width="980" alt="1 Factory컴파일(2)" src="https://user-images.githubusercontent.com/95120267/167282116-cdabc958-385c-4b25-8a79-a050d305a517.png">


<hr />

## 2. Token컨트랙트 컴파일 및 배포
유동성 풀에 공급하기 위해 필요한 토큰을 발행

<HJEthereum Token 발행>
<img width="983" alt="2 Token컴파일(1)" src="https://user-images.githubusercontent.com/95120267/167282118-1d9a6cf6-5088-4867-88ed-1cfb3684c23c.png">

<img width="982" alt="2 Token컴파일(3)" src="https://user-images.githubusercontent.com/95120267/167282122-db8bd471-9136-4cb6-af0a-d3da5217dfe6.png">


<HJBitcoin Token 발행>
<img width="982" alt="2 Token컴파일(2)" src="https://user-images.githubusercontent.com/95120267/167282120-f7433b81-7c3a-46c0-a40e-8124fdff05cb.png">

<img width="981" alt="2 Token컴파일(4)" src="https://user-images.githubusercontent.com/95120267/167282123-1cd75043-5b07-4abd-8bc0-6de4b8362085.png">



<hr />

## 3. UniswapV2Router02 컨트랙트 컴파일 및 배포

배포하기 위해서는 배포 Factory주소와 WETH 주소가 필요
Depolyed Contracts에 배포되어있는 UniswapV2Factory와 WETH9의 주소를 복사해서 넣어주고 transact을 누른다.
[WETH주소](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code)
<img width="982" alt="3 UniswapV2Router02컴파일(1)" src="https://user-images.githubusercontent.com/95120267/167282181-fcdecc46-9907-4ab4-aa5a-89f017f7e879.png">
<img width="983" alt="3 UniswapV2Router02컴파일(2)" src="https://user-images.githubusercontent.com/95120267/167282188-9308bf9d-f1f2-41d9-b022-3144d3d73e0a.png">



<hr />

## 4. Router 컨트랙트에게 토큰을 사용할 권한을 approve

배포한 Token컨트랙트에서 Router컨트랙트를 approve
spender에 배포된 Router 주소를, amount에는 발행한 HJB와 HJE의 발행량을 넣어준다.
<img width="982" alt="4 approve(1)" src="https://user-images.githubusercontent.com/95120267/167282192-07d062b3-4bf5-4e51-96d7-d72f7e860031.png">

<img width="977" alt="4 approve(2)" src="https://user-images.githubusercontent.com/95120267/167282194-8fe8ccec-2692-4789-80a7-e836bf9a56cc.png">

<img width="577" alt="4 approve(3)" src="https://user-images.githubusercontent.com/95120267/167282196-b41c4a79-491e-4677-9985-a8a3c4752ee3.png">


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
<img width="985" alt="5 addLiquidity함수(1)" src="https://user-images.githubusercontent.com/95120267/167282201-c682450d-d41c-476c-ad14-5c725f0f366d.png">

<img width="573" alt="5 addLiquidity함수(2)" src="https://user-images.githubusercontent.com/95120267/167282204-f657d903-674d-4589-9680-d24d75948a16.png">

<img width="351" alt="5 addLiquidity함수(3)" src="https://user-images.githubusercontent.com/95120267/167282207-372b8c45-a36a-40f6-8344-6d69e2a0ea4a.png">


<hr />

## 6.swapExactTokenForTokens

유동성 풀에 제공된 토큰을 가지고 거래(swap)을 해보겠습니다. 배포된 Router 컨트랙트에서 swapExactTokenForTokens함수를 연다

swapExactTokenForTokens 인자

- amountIn : 거래 시 넣을(input) 토큰의 양
- amountOutMin : 거래 시 받을(output) 토큰의 최소 양
- path : 거래할 토큰들의 주소를 배열 형태로 넣어주어야 한다 ( ["주소" , "주소"] )
- to : 거래 후 토큰을 받을 계정 주소(현재 account로 설정된 계정 주소)
- deadline : 거래 유효 기간
<img width="752" alt="스크린샷 2022-05-08 오후 1 34 32" src="https://user-images.githubusercontent.com/95120267/167282215-de613737-3257-4e5a-8fef-2aa235d03632.png">
<img width="349" alt="스크린샷 2022-05-08 오후 1 37 12" src="https://user-images.githubusercontent.com/95120267/167282217-e9c11f85-83eb-4034-887a-7be7753877bb.png">
<img width="349" alt="스크린샷 2022-05-08 오후 1 37 34" src="https://user-images.githubusercontent.com/95120267/167282219-181b5ed4-b3a0-4e29-ac26-7bd2dc85a30a.png">




<hr />
