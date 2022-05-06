# Remix 설치와 Contract Compile, 배포

DApp Contract를 개발하는 가장 쉬운 방법은 Remix를 이용하는 것 : >
VSCode 내에서 터미널을 하나 생성하고 아래 명령어를 차례대로 수행해 준다.

```
> npm install -g @remix-project/remixd
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
> remixd -s . --remix-ide https://remix.ethereum.org
```

remix ide(https://remix.ethereum.org)에 접속해서 Workspace에서 'connect to localhost'를 선택한다. 이후, 'connect'를 선택하면 local 디렉토리를 mapping 한다. 여기서 contract file(.sol)을 불러오거나 새로 생성한다.
