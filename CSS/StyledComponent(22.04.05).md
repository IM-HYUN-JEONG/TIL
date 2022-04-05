# [ styled-components ]

styled-components설치 : `npm i styled-components` <br />
규칙 : 파스칼케이스 / 태그 작성시 맨 앞글자는 대문자로 입력 <br />

상단에 `import styled from "styled-components";` import 한 후 사용
styled를 쓰고 점찍고 유효한 HTML태그를 작성 <br />
백틱 사이에 들어가는 부분은 CSS이어야 함 <br />

```
const Box = styled.div`
    background-color: red;
    width: 50px;
    height: 50px;
`;
```

# [ Extending Styles : 설정변경이 가능한 형태 ](https://styled-components.com/docs/basics#extending-styles)

1️⃣ props를 통해 컴포넌트르 설정 <br />
= prop이름을 전달하여 함수내에서 해당prop정보를 받음 <br />

```
const Box = styled.div`
    background-color: ${(props) => props.bgColor};
    width: 50px;
    height: 50px;
`;

<Box bgColor="red">
<Box bgColor="green">
```

2️⃣ styled(확장하려는 컴포넌트 이름) <br />

- 확장 : 기존컴포넌트의 모든 속성을 가져와 새로운 속성까지 더하는것
- 다른 컴포넌트의 스타일을 상속하는 새 컴포넌트를 쉽게 만들려면 styled() 생성자에 구성

```
const Button = styled.button`
    padding: 0.25em 1em;
    border: 2px solid black;
`;

const RedButton = styled(Button)`
    color: red;
`;
```

# [ as ](https://styled-components.com/docs/basics#extending-styles)

컴포넌트의 태그를 바꾸고싶지만 스타일은 바꾸고싶지않을경우, as을 사용하여 엘리먼트를 다른 엘리먼트로 교체할 수 있다. <br />

```
const Button = styled.button`
    padding: 0.25em 1em;
    border: 2px solid black;
`;

<Button /> ~> button태그
<Button as="a" href="/" /> ~> a태그
```

# [ Attaching additional props ](https://styled-components.com/docs/basics#attaching-additional-props)

속성값을 설정 <br />

```
const Input = styled.input.attrs({ required: true, minLength: 10 })`
    color: black;
`;
```

# [ Animations ](https://styled-components.com/docs/basics#animations)

styled component안에서 animation을 주는 방법은 helper function을 import해준다. <br />
`import styled, {keyframes} from "styled-components";` <br />
스타일 컴포넌트에서는 keyframes helper를 사용시 앱 전체에서 사용할 수 있는 고유한 인스턴스를 생성 (다른 파일에서 같은 이름의 keyframes가 존재하더라도 이름 충돌이 나지 않도록 해준다.) <br />

```
const movement = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const Circle = styled.div`
    height: 100px;
    width: 100px;
    background-color: red;
    border-radius: 50px
    animation: ${movement} 1s linear infinite;
`;
```

+a) styled component안에 다른 element의 스타일도 넣어줄수있음

```
const Box = styled.div`
    height: 100px;
    width: 100px;
    background-color: red;
    span {
        font-size: 20px;
        &:hover {
            font-size: 60px;
        }
        &:active {
            opacity: 0;
        }
    }
`;

<Box>
    <span>Hello</span>
</Box>
```

+a) styled component안에 element를 선택하는 다른 방법

```
const Text = styled.div`
    font-size: 20px;
`;

const Box = styled.div`
    height: 100px;
    width: 100px;
    background-color: red;
    ${Text} {
        &:hover {
            font-size: 60px;
        }
        &:active {
            opacity: 0;
        }
    }
`;

<Box>
    <Text>Hello</Text>
</Box>
```

# [ Theming ](https://styled-components.com/docs/advanced)

- Theme : 기본적으로 모든 색상들을 갖고있는 object, 모든색상으로 하나의 object안에 넣어둬서 매우 유용함(~> 색상을 바꿀때 그 object만 바꿔주면됨)
- dark,light모드를가지려면 property들의 이름이 같아야함

  styled components는 ThemeProvider wrapper 컴포넌트를 통해 전체 테마를 지원한다.
  이 컴포넌트는 컨텍스트 API를 통해 자체 아래에 있는 모든 React 구성 요소에 테마를 제공
  렌더 트리에서 모든 스타일 구성 요소는 여러 수준의 깊이에 있는 경우에도 제공된 테마에 액세스할 수 있습니다.

index.js에서
`import { ThemeProvider } from "styled-components";`

```
const whiteTheme = {
  textColor: "#111",
  backgroundColor: "whitesmoke",
};

const darkTheme = {
  textColor: "whitesmoke",
  backgroundColor: "#111",
};

root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

## [ The theme prop ](https://styled-components.com/docs/advanced#the-theme-prop)

theme는 theme prop을 사용하여 컴포넌트로 전달될 수도 있다.

App.js

```
color: ${props => props.theme.main};
```
