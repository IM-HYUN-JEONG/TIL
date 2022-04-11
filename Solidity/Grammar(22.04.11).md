- is : 다른 계약서를 상속(파생) 받기 위해 사용.

- event : 블록체인에서 일어나는 활동을 추적하기 위해 event를 사용합니다. event를 호출하면, 블록체인에 특별한 데이터 구조를 가진 transaction’s log에 인자값들이 저장.
- indexed : 최대 3개의 파라미터에 indexed 속성을 부여할 수 있습니다.<br />
  이 파라미터들은 transaction’s log 데이터에 저장되지 않고, [ topics ]라고 알려진 데이터 구조에 저장됩니다. <br />
  topics는 event를 검색할때 사용.
- mapping : 매핑 타입은 mapping(\_KeyType => \_ValueType) 와 같이 선언됩니다. <br />
  매핑은 사실상 해시 테이블로 볼 수 있습니다. <br />
  매핑은 상태변수(또는 내부 함수에서의 스토리지 참조 타입)에만 허용됩니다.

  - \_KeyType : 매핑, 동적 크기 배열, 컨트랙트, 열거형, 구조체를 제외한 거의 모든 유형이 될 수 있습니다.
  - \_ValueType : 매핑 타입을 포함한 어떤 타입이든 될 수 있습니다.

- private : 해당 함수를 계약서 내부에서만 호출할 수 있습니다.
- public : 내부/외부 모두에서 해당 함수를 호출할 수 있습니다.
- internal : 내부 혹은 상속된 계약서에서 호출할 수 있습니다.
- external : 외부에서만 호출할 수 있습니다. (계약서 내부에서도 호출할 수 없습니다.)

- struct : 새로운 타입을 정의하는 방법을 제공합니다. <br />
  구조체 타입은 매핑과 배열의 내부에서 사용될 수 있으며 구조체 역시 내부에 매핑과 배열을 포함할 수 있습니다.
- address : 20바이트 크기의 주소 관련 object를 가집니다. 모든 계약서의 기반이 됩니다.

  - ⭐️balance : address의 잔고를 조회
  - ⭐️transfer : 다른 address에 토큰 전송
  - send : low-level 수준에서 transfer에 대응
  - call : 호출된 함수가 종료되었는지(true) 아니면 예외를 발생시켰는지를(false) 나타내는 boolean을 반환
  - delegatecall : 다른 컨트랙트에 저장된 라이브러리 코드를 사용

- memory : 단순히 구조체의 값을 복사하거나 임시 변수로써 활용하고 싶을때 사용 됩니다. 임시적으로 저장되는 변수로 함수의 외부 호출이 일어날 때마다 초기화됩니다.
- \_mint() : ERC721 표준안의 Transfer() event를 사용해 새로운 NFT를 발행합니다.
  전역 네임스페이스(global namespace)에는 특수한 변수와 함수가 존재하며 이들은 주로 블록체인에 관한 정보를 제공하는데 사용됩니다.

- block.blockhash(uint blockNumber) returns (bytes32) : 현재를 제외한 가장 최근 256개 블록의 hash를 가짐
- block.coinbase (address) : 현재 블록 채굴자의 address
- block.difficulty (uint) : 현재 블록 난이도
- block.gaslimit (uint) : 현재 블록 gaslimit
- block.number (uint) : 현재 블록 번호
- block.timestamp (uint) : unix epoch 이후의 현재 블록 타임스탬프
- gasleft() returns (uint256) : 잔여 가스
- msg.data (bytes) : 완전한 calldata
- msg.sender (address) : 메세지 발신자 (현재 호출)
- msg.sig (bytes4 ): calldata의 첫 4바이트(즉, 함수 식별자)
- msg.value (uint) : 메세지와 함께 전송된 gas 수
- now (uint) : 현재 블록 타임스탬프(block.timestamp 의 별칭)
- tx.gasprice (uint) : 트랜잭션의 가스 가격
- tx.origin (address) : 트랜잭션의 발신자 (full call chain)
- emit : event를 호출할때 사용합니다.
- ⭐️ totalSupply() : ERC721Enumerable 표준안의 totalSupply() 함수를 사용해 계약서의 NFT 갯수를 조회합니다.
- ⭐️ safeTransferFrom() : ERC721 표준안의 safeTransferFrom() 함수를 사용해 주어진 토큰의 소유권을 다른 주소로 안전하게 전송합니다.

- transferFrom() : ERC721 표준안의 transferFrom() 함수를 사용해 주어진 토큰의 소유권을 다른 주소로 전송합니다. 이 메소드는 사용하지 않는 것이 좋습니다. 가능하다면 safeTransferFrom() 함수를 사용하세요.
- storage : memory와는 다르게 블록체인에 영구적으로 저장할때 사용합니다.

- view : function 밖의 변수들을 읽을 수 있으나 변경은 불가능할때 선언합니다.

- pure : function 밖의 변수들을 읽을 수도 없고, 변경은 불가능할때 선언합니다.
- require : 특정한 조건에 부합하지 않으면 에러를 발생시키고, gas를 환불합니다.
- assert : gas를 다 소비한 후, 특정한 조건에 부합하지 않으면 에러를 발생시킵니다.
- revert : 조건없이 에러를 발생시키고, gas를 환불합니다.
