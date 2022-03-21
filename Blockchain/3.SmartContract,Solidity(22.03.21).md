## SmartContract

- 블록체인에 저장되어있는 프로그램이다
- 어디에 저장되어있는지 알기 위해서 주소를 쓰는 것
- 주소를 쓰는 것이 account이다보니까 account와 같은 취급을 함
- 이더리움 코드에는 account코드와 codeHash라는 값이 있음, codeHash로 블록체인에 저장되어있는 코드를 불러올 수 있는 구조

<hr />

- SmartContract = Code(함수) + Data(상태)
  - 함수를 쪼개보면 1)상태변경O함수 2)상태변경X함수 로 나뉨
- SmartContract를 실행하다보면 상태가 변경될 수도 있음
- 블록체인에서 상태를 변경할 수 있는것은 TX밖에 없다.
- 그래서 TX로 컨트랙트를 실행하고, TX의 결과가 컨트랙트에 반영되는 것

<hr />

- 특정주소에 배포되어 있는 TX로 실행가능한 코드
  - SmartContract 소스코드는 함수와 상태를 표현 : Contract 소스코드는 블록체인에 저장
  - 함수는 상태를 변경하는 함수, 상태를 변경하지 않는 함수로 분류
  - 사용자 (end user, EOA owner)가 SmartContract 함수를 실행하거나 상태를 읽을 때 주소가 필요함
- SmartContract는 사용자가 실행
  - 상태를 변경하는 함수를 실행하려면 그에 맞는 TX를 생성하여 블록에 추가 (TX체결 = 함수의 실행)
  - 상태를 변경하지 않는 함수, 상태를 읽는 행위는 TX가 필요없다 (노드에서 실행)

<hr />

## Solidity

- Ethereum/Klaytn에서 지원하는 SmartContract언어
  - 즉, Solidity로 SmartContract를 만들 수 있음
- Klaytn은 Solidity 버전0.4.24, 0.5.6을 지원
- 일반적인 프로그래밍 언어와 그 문법과 사용이 유사하나 몇가지 제약이 존재
  - 포인터(메모리상의 주소를 가리키는 것)개념이 없기에 recursive type의 선언이 불가능
  - Solidity의 주소들은 메모리주소들이 아닌 실제 블록체인의 account주소들

<hr />

## Contract = Code(함수) + Data(상태)

- Solidity Contract는 Code(함수)안에 변수로 선언된 Data(상태)를 변경하거나 불러온다.
- 아래예시에서 set,get은 Code(함수) / storedData는 Data(상태)

```
contract SimpleStorage{
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }
    function get() public view returns (uint) {
        return storedData;
    }
}
```

uint = 항사 양의 정수

<hr />

컨트랙트를 만든다 = 컨트랙트를 정의한다

## Solidity 예제

- Solidity로 간단한 포인트시스템을 구현
- [Coin 컨트랙트]
  - 컨트랙트 생성자가 관리하는 포인트 시스템 컨트랙트로 포인트시스템 고유의 주소공간(address space)을 가지며 각 주소의 포인트 잔고를 기록한다
  - 컨트랙트 생성자는 사용자 주소에 포인트를 부여할 수 있고, 사용자는 다른사용자에게 포인트를 전송할 수 있다. (0x@@ -> 0x##, 10coin)

<hr />

<상태 (State Variables)>

```
pragma solidity ^0.5.6;
//solidity버전을 지정

contract Coin{
    address public minter;
    mapping (address => uint) public balances;
}
//contract x {...} : x라는 컨트랙트를 정의
//minter : address타입으로 선언된 상태, address타입은 Ethereum에서 사용하는 160-bit 주소
//public : 상태를 다른 컨트랙트에서 읽을 수 있도록 허용
//balances : mapping타입으로 address타입데이터를 key로, uint타입데이터를 value로 가지는 key-value mapping
//mapping은 타 프로그래밍 언어에서 사용하는 해시테이블 자료구조와 유사 (uninitialized값들은 모드 0으로 초기화되어있는 상태)
```

<hr />

<이벤트 (Events)> : 어떤 지점에서 실행되었다는 것을 기록하고 싶을 때

```
contract Coin{
    event Sent(address from, address to, uint amount);
}

//event로 정의된 타입은 클라이언트(application using a platform-specific SDK/library)가 listening할 수 있는 데이터로 emit키워드로 해당 타입의 객체를 생성하여 클라이언트에게 정보를 전달

//usage:
// /* in Solidity */
//emit Sent(an_address, another_address, 10);
// /* in Web3.js */
//Coin.sent().watch({}, '', function(err, result) {...});
```

<hr />

<생성자 (Constructor)> : 컨트랙트가 생성되는 시점 단 1번만 실행되는 함수

```
//컨트랙트 함수는 함수를 실행한 TX의 정보를 받을 수 있는데 해당정보를 msg변수로 접근

contract Coin{
    constructor() public {
        minter = msg.sender;
    }
    //생성자함수는 컨트랙트가 실행될 때 한번 실행
    //minter상태변수에 msg.sender값을 대입(함수를 실행한 사람의 주소)
}
```

<hr />

<함수 (Functions)>

```
contract Coin{
    function mint(address receiver, uint amount) public {
        require(msg.sender == minter);
        require(amount < 1e60);
        balances[receiver] += amount;
    }
}

//receiver주소에 amount만큼의 새로운 Coin을 부여
//require함수는 입력값이 true일때만 다음으로 진행할 수 있음 (타언어의 assert와 유사)
//require함수는 특정조건을 만족할 경우에만 함수를 실행할 수 있도록 강제할 때 사용

//msg = 최초의 트랜잭션이라고 생각하면 됨
//함수를 실행한 사람이 minter(컨트랙트소유자)일때만 진행
//새로 생성하는 coin의 양이 1 * 10^60개 미만일 때만 진행
//receiver주소에 amount만큼을 더함
```

- 컨트랙트가 컨트랙트를 실행할 수 있음
- 사용자가 TX를 보내서 컨트랙트를 실행했는데, 그 실행 과정 중에서 다른 컨트랙트를 실행할 수 있음
- 컨트랙트를 호출하는 방법은 TX밖에 없음
- msg.sender = 최초의 사용자
- TX의 sender = 누구나 될 수 있음

```
contract Coin{

    //msg.sender가 receiver에게 amount만큼 Coin을 전송
    function send(address receiver, uinnt amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance.");
        balances[msg.sender] -= amount;             //잔고차감
        balances[receiver] += amount;               //잔고증가
        emit Sent(msg.sender, receiver, amount);    //이벤트 생성
    }
}
```

- from이 빠졌는데, 이는 msg.sender로 유추할 수 있음 ➡️ 명시적으로 나타내지 않아도 됨

<hr />

## Solidity 소스코드 컴파일링

- 컴파일링 = 컴퓨터가 이해할 수 있도록 바꾸는 것 (10101010~)
- Solidity 소스코드는 배포(저장)에 앞서 EVM에서 실행가능한 형태로 컴파일(변환)되어야 한다
- solc - Solidity 컴파일러

  - npm으로 light version을 설치가능 (solcjs, partial feature)
  - `npm install -g solc`
  - brew(macos)등으로 binary설치가능 (solc, full feature)
  - `brew tap ethereum/ethereum`, `brew install solidity`

  <hr />

- SimpleStorage컨트랙트를 정의하는 test.sol이 있다고 가정
- 다음과 같은 방법으로 test.sol을 컴파일한다

```
>ls
test.sol
>solcjs --bin true --abi true -o out test.sol
>ls
out test.sol
>tree out
out
-test_sol_SimpleStorage.abi
-test_sol_SimpleStorage.bin

0directories, 2 files
```

<hr />

## Bytecode & ABI

Solidity 소스코드(sol파일)를 컴파일하면 Bytecode(.bin파일)와 ABI(.abi파일)가 생성

1. Bytecode

- 컨트랙트를 배포할 때 블록체인에 저장하는 정보
- Bytecode는 Solidity소스코드를 EVM이 이해할 수 있는 형태로 변환한 것
- 컨트랙트 배포시 HEX로 변환된 Bytecode를 TX에 담아 노드에 전달

2. ABI(Application Binary Interface) a.k.a JSON interface

- ABI는 컨트랙트함수를 JSON형태로 표현한 정보로 EVM이 컨트랙트 함수를 실행할 떄 필요
- 컨트랙트 함수를 실행하려는 사람은 ABI 정보를 노드에 제공

<hr />

## Klaytn SDK: caver-js (Software Development Kit)

- Klaytn은 BApp개발을 위해 필요한 SDK를 제공
- caver-js는 Node.js로 Klaytn BApp을 만들 때 필요한 라이브러리를 제공
- [공식Docs 홈페이지](https://ko.docs.klaytn.com/dapp/sdk/caver-js/getting-started)

<hr />

## 개발환경 셋팅

1. Node.js설치

- https://nodejs.org에서 설치

2. 개발디렉토리 생성 및 Caver-js 설치

- 성공적으로 Node.js를 설치한 뒤 원하는 위치에 디렉토리를 생성
  `mkdir Count && cd Count`
- 디렉토리 생성 후 npm으로 Node.js프로젝트를 초기화, Caver-js를 설치
  `npm init`, `npm install caver-js`

<hr />

## Baobab 테스트넷에 연결

`const Caver = require('caver-js');`
`const caver = new Caver('https://api.baobab.klaytn.net:8651/')`

### klay.getBlockNumber()

```
caver.klay.getBlockNumber(function(err, blockNumber){
    console.log(blockNumber);
})
```

위와 아래는 같은내용이다.

```
caver.klay.getBlockNumber().then(console.log);
```

### klay.accounts.wallet

```
const account = caver.klay.accounts.create(); //이것이 실행되면 키페어(비밀키,공개키)가 생성된다
//in memory wallet
const wallet = caver.klay.accounts.wallet;
wallet.add(account);⭐️

console.log(wallet.length);     //wallet에 저장된 어카운트 갯수를 리턴
console.log(wallet[account.address]);    //해당 주소를 가지는 어카운트를 불러옴, 없을경우 undefined
console.log(wallet[0]);    //저장된 첫번째 어카운트를 불러옴, 없을경우 undefined
```

### 토큰전송TX생성 & 서명

```
wallet.clear(); wallet.create(2);  //in memory wallet초기화, 어카운트 2개 생성

const tx = {
    type: "VALUE_TRANSFER", from: wallet[0].address, to: wallet[1].address;
    value: caver.utils.toPeb('1', 'KLAY'),
    gas: 300000   //TX가 사용할 수 있는 가스 총량
}
//첫번째 어카운트의 비밀키로 서명
caver.klay.accounts.signTransaction(tx, wallet[0].privateKey).then(console.log)
```

### 서명된 TX 전송

```
const tx = {...};
(async () => {
    const signedTransaction = await caver.klay.accounts.signedTransaction(tx, sender.privateKey);
    await caver.klay.signedTransaction(signedTransaction.rawTransaction)
        .on('transactionHash', function(txHash) { console.log('hash first', txhash); })
        .on('receipt', function(receipt) { console.log('receipt later', receipt); })
        .on('error', function(err) { console.error('something went wrong'); })
})();
```

on = 이벤트를 리스닝하는 구문
transactionHash,receipt,error라는 이벤트가 나올경우 뒤에있는 함수를 실행한다

- transactionHash : 노드가 TX를 잘 받았다고 알려주는 함수
- receipt : 실제 TX가 체결되어 블록에 들어갈 경우 보내주는 것

- 순서 : transactionHash -> receipt

### 토큰전송TX + sendTransaction

```
const tx = {...};
caver.klay.sendTransaction(tx); //서명+전송
    .on('transactionHash', function(txHash) { console.log('hash first', txhash); })
    .on('error', function(err) { console.error('something went wrong'); })
    .on('receipt', function(receipt) { console.log('receipt later', receipt); })
```

### 스마트 컨트랙트 배포

👉🏻이 방법을 사용하는 것보단 트러플을 사용하는것이 더 편함. 아래의 방법도 있다라는것만 알아둘것

```
const abi = [...];
const contract = new caver.klay.Contract(abi);
contract.deploy({ data: '71892789...212' })
    .send({from: wallet[1].address,
           gas: 300000,
           value: 0})
    .on('receipt', function (receipt) {
        //컨트랙트 주소가 receipt에 포함
        console.log('contract deployed at', receipt.contractAddress);
    })
```

### 스마트 컨트랙트 함수 실행(mutation)

```
const contract = new caver.klay.Contract(abi, "0x~~주소");
contract.methods.set(100)
    .send({
        from: wallet[1].address,
        gas: 300000
    })
    .on('error', function (hash) {...})
    .on('transactionHash', function (hash) {...})
    .on('receipt', function (receipt) {...})
```

set함수는 state를 변경하는 함수이기에 TX을 발생시켜야하고 실행하는 댓가로 gas비를 내야 함

### 스마트 컨트랙트 함수 실행(constant)

```
const contract = new caver.klay.Contract(abi, "0x~~주소");
contract.methods.get().call(null, function (err, result) {
    if (err == null) {
        console.log(result);
    } else {
        console.error(err);
    }
});
```

call함수는 state를 바꾸는 함수가 아니기 때문에 노드에서 바로 실행 (=TX를 안보냄)
