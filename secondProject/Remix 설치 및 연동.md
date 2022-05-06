# Remix 설치와 Contract Compile, 배포

DApp Contract를 개발하는 가장 쉬운 방법은 Remix를 이용하는 것 : >
VSCode 내에서 터미널에서 생성하고 아래 명령어를 차례대로 수행힌다.

```
> npm install -g @remix-project/remixd
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
> remixd -s . --remix-ide https://remix.ethereum.org
```

remix ide(https://remix.ethereum.org)에 접속하여 workspace에서 'connect to localhost'를 선택한다. 
이후, 'connect'를 선택하면 local 디렉토리를 mapping 한다. 
여기서 contract file(.sol)을 불러오거나 새로 생성한다.

<br/>
<hr/>
<img width="852" alt="스크린샷 2022-05-06 오후 4 29 49" src="https://user-images.githubusercontent.com/95120267/167087415-695c281c-dc3b-4737-b9f4-ebc8b194da96.png">

<img width="849" alt="스크린샷 2022-05-06 오후 4 29 58" src="https://user-images.githubusercontent.com/95120267/167087426-772ea020-8704-41fe-899a-009a680f6b04.png">

<img width="847" alt="스크린샷 2022-05-06 오후 4 30 11" src="https://user-images.githubusercontent.com/95120267/167087431-04f1fcde-3d68-4553-bda8-f8c7f53e58d9.png">
