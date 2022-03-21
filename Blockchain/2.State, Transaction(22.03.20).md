## Klaytn BFT

- 1/3이상이 이의를 제기해야 블록생성이 안됨 -> 그럼 2/3이상이 담합하면??
- Klaytn은 확장가능한 BFT를 사용
  - N개의 노드 가운데 S개의 부분노드 집합을 확률적으로 선택 (where N is large, and S is sufficiently small)
  - 전체집합을 거버넌스 카운실 (Governance Council), 부분집합을 커미티(Committee)로 정의
  - 커미티 선택은 VRF(Verifiable Random Function)로 구해진 무작위값에 기반
- 매 불록마다 새 커미티를 뽑아 BFT를 실행
- 기존의 BFT에 비해 확장성을 크게 개선

<hr />

## 블록체인의 상태

### (어카운트기반) 블록체인의 상태

- 블록체인은 트랜잭션으로 변화하는 상태기계 (state machine)
- 초기값 + 변경 = 최종값
- 초기값 : 이전 블록의 상태
- 최종값 : 현재블록의 상태

### 상태 기계

- 블록체인은 초기 상태에서 변경사항을 적용하여 최종상태로 변화하는 상태기계
  - 이전 블록의 최종상태(final state)는 현재블록의 초기상태(initial state)
  - Gen Block의 경우 임의의 초기값들이 설정되는데 이것이 gen block의 초기상태이자 최종상태
- (어카운트기반) 블록체인의 상태
  - TX는 어카운트를 생성하거나 변경
    - 예) A가 B에게 토큰을 전송하여 A,B의 잔고가 변경
  - 항상 같은 결과를 보장하기 위해 하나의 TX가 반영되는 과정에서 다른 TX의 개입은 제한됨

<hr />

## (복습) Ethereum어카운트 종류

- 1. External Account : 사용자(end user)가 사용하는 어카운트 (EOA)
- 2. Contract Account : 스마트컨트랙트를 표현하는 어카운트
- Ethereum은 EOA와 스마트컨트랙트의 상태를 기록 및 유지
  - 스마트컨트랙트는 특정주소에 존재하는 실행가능한 프로그램
  - 프로그램은 상태를 가지기 때문에 Ethereum/Klaytn은 스마트컨트랙트를 어카운트로 표현
- EOA는 블록에 기록되는 TX를 생성
  - 블록에 기록되는 TX들은 명시적인 변경을 일으킴 (토큰전송, 스마트컨트랙트 배포.실행)

<hr />

## 트랜잭션(TX)과 가스(Gas)

- TX의 목적은 블록체인의 상태를 변경하는 것
  - TX는 보내는사람(sender, from)과 받는사람(recipient, to)이 지정되어 있으며 to가 누구냐에 따라 TX의 목적이 세분화
- Gas : TX를 처리하는데 발생하는 비용
  - TX를 처리하는데 필요한 자원(computing power, storage)을 비용으로 전환한 것이 가스
  - sender는 TX의 처리를 위해 필요한 가스의 총량과 같은 가치의 플랫폼 토큰을 제공해야 함
  - 이때 지출되는 플랫폼 토큰을 가스비(Gas Fee)라 정의
  - 가스비는 블록을 생성한 노드가 수집

## 트랜잭션(TX)과 서명

- 플랫폼은 sender가 TX가 처리되는데 필요한 가스비를 가지고 있는지 확인
  - 가스비 확인은 구현에 따라 상이
  - Ethereum/Klaytn은 노드가 TX를 수신함과 동시에 가스비 이상의 balance가 있는지 확인
  - TX체결과 동시에 sender의 balance에서 가스비를 차감
- TX는 sender의 서명(v,r,s)이 필요
  - 어카운트의 balance를 사용하기 때문
  - 서명의 증명은 구현마다 상이
    - Ethereum : 서명 -> 공개키 도출 -> 어카운트 주소 도출 -> 어카운트 존재유무 확인 (\*서명 -> 공개키 도출과정의 함수로 인해 연산량이 늘어남)
    - Klaytn : from주소확인 -> 저장된 공개키 불러오기 -> 서명 직접 검증

## 블록체인별 트랜잭션(TX)

```
{
    nonce: 1, -> account가 몇번쨰 TX을 보내는지 말해주는 것
    from: "0x~", -> sender의 주소
    to: "0x~", -> recipient의 주소
    value: n,
}
```

- Ethereum TX

```
{
    nonce: 1,
    gasPrice: "0x~",
    pas: "0x~",
    value: n,

    to: "0x~",
    v: "0x@@",
    r: "0x~",
    s: "0x~",
}
```

to를 확인하기 전까지는 무슨 TX인지 모름
to가 External account이면 토큰전송TX일것이고, Contract address이면 컨트랙트 실행, 빈칸일 경우 컨트랙트 배포를 짐작함

- Klaytn TX

```
{
    *type: "VALUE_TRANSFER",
    nonce: "0x01",
    gasPrice: "0x~",
    pas: "0x~",
    value: n,

    to: "0x~",
    *from: "0x~",
    v: "0x@@",
    r: "0x~",
    s: "0x~",
}
```

gasPrice를 사용자가 변경할 수 없음 (고정된 값)

<hr />

## 트랜잭션(TX)의 이동경로

- 트랜잭션(TX)은 External account만 만들 수 있고 보낼 수 있다

1. User가 TX을 만들어서 어떤 Node에게 전달함
2. 받은 노드는 블록에 넣기위한 노력을 함
3. 블록에 들어간 순간, User에게 receipt(영수증)을 줌

- TX이 실행되었고, 실행결과를 알려주는 값이 적혀있음

### User와 Node사이의 통신

- User ➡️ Node
  - User는 TX생성, 서명하여 Node에게 전달
  - 이때 데이터구조를 온전하게 전달하고자 RLP알고리즘으로 TX직렬화
  - ⭐️User와 Node가 같은 프로토콜로 통신하는 것이 중요⭐️
- Node ➡️ User
  - 올바른 TX수신 시 TX해시를 반환
  - TX체결 시, Receipt를 반환 : 소요된 gas, TxHash, input등이 기록
