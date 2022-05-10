# 클레임스왑 ClsToken 컨트랙트

클레임스왑에 [클레임]메뉴에 얼음/땡 이라는 기능이 있다.
마치 적금과 같은 개념으로 일정기간동안 CLA토큰을 예치해두면, CLS토큰을 얼린CLA양\*얼린기간 만큼 수령할 수 있다.
CLA 얼리기 버튼을 누르면 컨트랙트의 어떤 함수가 실행되는지 살펴보자

90일 얼렸을 경우, 180일 얼렸을 경우, 270일 얼렸을 경우 mint(address to, uint256 amount, uint8 multiple)함수를 호출하고 있고, 이 셋의 차이점은 multiple(Multiple of CLA to lock.)이 1, 2, 4로 바뀐다는 차이점을 가지고 있다.

[scope를 확인해보면](https://scope.klaytn.com/tx/0x88a15c2cc7a9f524e191ae3edcecac6b006ba13f508787376008070d63cd8b6d?tabId=internalTx)

1. 내 주소가 CLS주소로 mint함수를 호출하고
   - CLS주소는 `0x1df6...eb8db8`로 mint함수를 호출하고
   - CLS주소는 CLA주소에 transferFrom함수를 호출
   - CLS주소는 `0x747f...864495`에 deposit함수를 호출함
     - `0x747f...864495`는 `0xa511...03eff9`에 deposit함수를 호출함
   - CLS주소는 `0xe9e1...db2447`에 deposit함수를 호출함
     - `0xe9e1...db2447`는 CLS주소로 totalSupply함수를 호출
     - CLS주소가 `0x1df6...eb8db8`로 totalSupply함수를 호출
   - `0xe9e1...db2447`가 `0x54fb...baf09e`에 transfer함수 호출
     - `0x54fb...baf09e`가 CLA함수에게 transfer함수 호출

<hr />

## <mint함수의 인자 설명>

- to = CLS Receiver (0x5f5dec0d6402408ee81f52ab985a9c665b6e6010).
- amount = Amount of CLA to lock.
- multiple = Multiple of CLA to lock.

```
  /// @dev Multiple to lockup period.
  mapping(uint8 => uint32) public multipleToLockup;
```

## <mint함수>

```
function mint(address to, uint256 amount, uint8 multiple) public {
        uint32 lockupPeriod = multipleToLockup[multiple];
        require(lockupPeriod != 0, "Invalid multiple");
        require(amount > 0, "Mint amount is zero");
        uint32 endDay = _getDay().add(lockupPeriod);

        cla.safeTransferFrom(msg.sender, address(this), amount);

        TokenLockList storage tokenLockList = locked[to][multiple];
        uint256 endIdx = tokenLockList.lockedList.length;
        if (
            endIdx != 0
            && tokenLockList.lockedList[endIdx - 1].endDay == endDay
            && tokenLockList.startIdx < endIdx
        ) {
            tokenLockList.lockedList[endIdx - 1].claAmount = tokenLockList
                .lockedList[endIdx - 1]
                .claAmount
                .add(amount);
        } else {
            tokenLockList.lockedList.push(
                TokenLock({claAmount: amount, endDay: endDay})
            );
        }
        _mint(to, amount.mul(multiple));
       emit Mint(msg.sender, to, amount.mul(multiple), multiple);
    }
```

mint함수의 인자는 CLS받는곳, claLockAmount, claLockPeriod가 들어가고
lockupPeriod는 multipleToLockup에 multiple(1,2,4)를 넣어 매핑을하여 락업기간을 설정한다.
조건1. lockupPeriod가 0이 아니어야하고
조건2. claLockAmount는 0 이상이어야 한다.
이 두조건이 충족했을떄 다음 코드로 넘어간다.

## <\_getDay함수>

```
function _getDay() private view returns (uint32) {
        return (block.timestamp / 1 days).toUint32();
    }
```

endDay는 오늘날짜를 구하고 + lock기간을 더해준다.

<hr />

```
IERC20 public cla;
```

cla주소에 safeTransferFrom함수를 호출하여
내가(msg.sender) CLS Receiver에게(address(this)= 컨트랙트 자기자신) claLockAmount를 보낸다.

## <safeTransferFrom함수>

```
function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
    callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }
```

## <callOptionalReturn함수>

```
function callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves.

        // A Solidity high level call has three parts:
        //  1. The target address is checked to verify it contains contract code
        //  2. The call itself is made, and success asserted
        //  3. The return value is decoded, which in turn checks the size of the returned data.
        // solhint-disable-next-line max-line-length
        require(address(token).isContract(), "SafeERC20: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = address(token).call(data);
        require(success, "SafeERC20: low-level call failed");

        if (returndata.length > 0) { // Return data is optional
            // solhint-disable-next-line max-line-length
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
```

<hr />

```
/// @dev CLA timelock.
/// `claAmount` Amount of deposited CLAs.
/// `endDay` When tokens are unlocked.

struct TokenLock {
        uint256 claAmount;
        uint32 endDay;
}
```

```
/// @dev CLA timelock list.
/// `lockedList` list of CLA timelock.
/// `startIdx` start index of lockedList.
/// `unlockableAmount` amount of CLA unlockable.

struct TokenLockList {
        TokenLock[] lockedList;
        uint256 startIdx;
        uint256 unlockableAmount;
}
```

```
    /// @dev TokenLockList for locked tokens.
    mapping(address => mapping(uint8 => TokenLockList)) public locked;
    /// @dev TokenLockList for claimed tokens.
    mapping(address => TokenLockList) public claimLocked;
    /// @dev Multiple to lockup period.
    mapping(uint8 => uint32) public multipleToLockup;
    /// @dev TokenLockList for migration reward.
    mapping(address => TokenLock) public migrationLocked;
```

TokenLockList구조체에 저장(Storage는 블록체인 상에 영구적으로 저장)을 한다
tokenLockList는 locked[to][multiple]이다.

endIdx는 tokenLockList안에있는 lockedList의 길이를 구한값
만약 endIdx가 0이 아니고, 맨마지막 리스트의 endDay가 endDay와 같고, tokenLockList가 여러개 라면
tokenLockList.lockedList[endIdx - 1].claAmount 는 기존+claLockAmount를 더한다.
수령일자가 동일하다면 리스트를 새로 안만들고 기존것에 누적한다는 뜻

그것이 아니라면 lockedList에 새로운 lock정보를 생성한다.

\_mint(to, amount.mul(multiple))함수 실행
emit Mint이벤트 실행

<hr />

## <\_mint함수>

```
    function _mint(address account, uint256 amount) internal {
        super._mint(account, amount);
        feeDistributor.deposit(account, amount);
        claDistributor.deposit(account, amount);
        _moveDelegates(address(0), _delegates[account], amount);
    }
```

\_mint함수에 전달된 현재 account = CLS Receiver, amount = amount.mul(multiple)
feeDistributor와 claDistributor에 deposit함수를 호출하고
\_moveDelegates함수를 호출한다.

```
interface IFeeDistributor {
    function deposit(address user, uint256 amount) external;
    function withdraw(address user, uint256 amount) external;
}

interface IClaDistributor {
    function deposit(address user, uint256 amount) external;
    function withdraw(address user, uint256 amount) external;
}

IFeeDistributor public feeDistributor;
IClaDistributor public claDistributor;
```

```
/// @notice A record of each accounts delegate
mapping(address => address) internal _delegates;
```

## <\_moveDelegates함수>

```
function _moveDelegates(address srcRep, address dstRep, uint256 amount) internal {
        if (srcRep != dstRep && amount > 0) {
            if (srcRep != address(0)) {
                // decrease old representative
                uint32 srcRepNum = numCheckpoints[srcRep];
                uint256 srcRepOld = srcRepNum > 0
                    ? checkpoints[srcRep][srcRepNum - 1].votes
                    : 0;
                uint256 srcRepNew = srcRepOld.sub(amount);
                _writeCheckpoint(srcRep, srcRepNum, srcRepOld, srcRepNew);
            }

            if (dstRep != address(0)) {
                // increase new representative
                uint32 dstRepNum = numCheckpoints[dstRep];
                uint256 dstRepOld = dstRepNum > 0
                    ? checkpoints[dstRep][dstRepNum - 1].votes
                    : 0;
                uint256 dstRepNew = dstRepOld.add(amount);
                _writeCheckpoint(dstRep, dstRepNum, dstRepOld, dstRepNew);
            }
        }
    }
```

\_moveDelegates함수는 인자로 address srcRep, address dstRep, uint256 amount를 받는다.
\_mint함수에서 \_moveDelegates(address(0), \_delegates[account], amount)를 호출하였다는걸 잊지말고 해석해보자
address(0)이 \_delegates[account]이 아니고 , amount가 0 이상이라면 다음을 실행한다.
현재 srcRep이 address(0)이므로 첫번째 if문은 실행 불가능하고 두번쨰 if문이 실행된다.
\_delegates[account]은 address(0)이 아니기에
dstRepNum은 numCheckpoints에 \_delegates[account]를 주어 uint32로 매핑한다.

```
/// @notice A record of votes checkpoints for each account, by index
mapping(address => mapping(uint32 => Checkpoint)) public checkpoints;

/// @notice The number of checkpoints for each account
mapping(address => uint32) public numCheckpoints;
```

dstRepOld는 dstRepNum이 0 이상이라면
checkpoints[\_delegates[account]][dstrepnum - 1].votes
dstRepNew는 dstRepOld에 amount를 더한 값
\_writeCheckpoint(dstRep, dstRepNum, dstRepOld, dstRepNew)함수를 호출한다

<hr />

## <\_writeCheckpoint함수>

```
    function _writeCheckpoint(
        address delegatee,
        uint32 nCheckpoints,
        uint256 oldVotes,
        uint256 newVotes
    ) internal {
        uint32 blockNumber = safe32(
            block.number,
            "CLS::_writeCheckpoint: block number exceeds 32 bits"
        );

        if (
            nCheckpoints > 0 &&
            checkpoints[delegatee][nCheckpoints - 1].fromBlock == blockNumber
        ) {
            checkpoints[delegatee][nCheckpoints - 1].votes = newVotes;
        } else {
            checkpoints[delegatee][nCheckpoints] = Checkpoint(
                blockNumber,
                newVotes
            );
            numCheckpoints[delegatee] = nCheckpoints + 1;
        }

        emit DelegateVotesChanged(delegatee, oldVotes, newVotes);
    }
```

```
    function safe32(uint256 n, string memory errorMessage)
        internal
        pure
        returns (uint32)
    {
        require(n < 2**32, errorMessage);
        return uint32(n);
    }
```

\_writeCheckpoint(dstRep, dstRepNum, dstRepOld, dstRepNew)함수를 호출하였으므로,
blockNumber는 block.number가 2\*\*32 미만이면 block.number를 반환해주고 넘는다면 에러메세지를 준다.
만약 nCheckpoints(=dstRepNum)이 0이상이고, checkpoints[delegatee][ncheckpoints - 1].fromBlock 이 blockNumber라면, checkpoints[delegatee][ncheckpoints - 1].votes = newVotes를 주고,
아니라면, else문을 시행한다.
emit DelegateVotesChanged이벤트를 실행함

```
/// @notice An event thats emitted when a delegate account's vote balance changes
event DelegateVotesChanged(
        address indexed delegate,
        uint256 previousBalance,
        uint256 newBalance
    );
```
