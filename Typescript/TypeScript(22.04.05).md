[ TypeScript ](https://www.typescriptlang.org/play)

- strongly-typed언어 : 프로그래밍언어가 작동하기 전에 type을 확인
- 코드가 실행되기 전에 오류를 확인하기위해 사용
- JavaScript를 기반으로 한 프로그래밍 언어

# [ Typescript 설정 ]

1. 기존 CRA(Create React App)으로 만든 프로젝트에 타입스크립트 설치
   `npm install --save typescript @types/node @types/react @types/react-dom @types/jest`
   +tsconfig.json파일이 없다면 추가로 설정

2. CRA(Create React App)을 타입스크립트로 시작하기
   `npx create-react-app my-app --template typescript` 또는
   You are running `create-react-app` 4.0.3, which is behind the latest release (5.0.0). 오류가 뜬다면 아래 명령어로 진행
   `npx create-react-app@5.0.0 my-app --template typescript`

- create-react-app의 글로벌 설치는 더 이상 지원되지 않습니다.
  이전에 `npm install -g create-react-app`를 통해 전역적으로 create-react-app을 설치한 경우 `npm uninstall -g create-react-app`을 사용하여 패키지를 제거하는 것이 좋습니다.

https://create-react-app.dev/docs/adding-typescript

DefinitelyTyped
https://github.com/DefinitelyTyped/DefinitelyTyped

# [interface]

- interface : object의 shape(객체모양)을 typescript에게 설명해주는 TS개념

```
interface PropsType {
    bgColor: string;
}

function X({ bgColor }: PropsType){
    return <div></div>;
}
```

## 옵션props

`?`만 달아주면된다.

```
interface PropsType {
    bgColor: string;
    borderColor?: string;
}
```

# [ ?? (Null 병합 연산자 (Nullish coalescing operator)) ](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/N)

`??` : 앞에 값이 null이거나 undefined이면 오른쪽 값을, 그렇지 않으면 왼쪽 값을 반환하는 논리연산자

```
null ?? "hello" // "hello"
undefined ?? "hello" // "hello"
"hi" ?? "hello" // "hi"
```

# useState의 TypeScript : useState < number > ( )

state의 type을 지정하려면 Generics안에 타입을 지정

일반적으로는 초기값을 지정하면 타입스크립트가 자동으로 타입을 유추하기 때문에 굳이 지정해주지 않지만, 상태가 undefined또는 null이 될 수도 있거나 객체 또는 배열일 때는 지정해주는 것이 좋다!

ex) const [ value, setValue ] = useState< Value | null >(null);

# Forms

```
function App(){
    const [value, setValue] = useState("");

    const onChange = (event: React.FormEvent<HTMLInputElement>) => {
        const {
            currentTarget: {value},
        } = event;
        setValue(value);
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    return (
        <div>
            <form onSubmit={onSubmit} >
                <input
                value={value}
                onChange={onChange}
                type="text"
                 />
            </form>
        </div>
    )
}
```

# Styled-components (TypeScript)

DefaultTheme는 기본적으로 props.theme의 인터페이스로 사용됩니다.
기본적으로 DefaultTheme 인터페이스는 비어 있으므로 확장해야 합니다.

< styled.d.ts >

```
// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
    export interface DefaultTheme {
        textColor: string;
        bgColor: string;

        colors: {
            main: string;
            pages: string;
        }
    }
}
```

< theme.ts >

```
import { DefaultTheme } from "styled-components";

export const lightTheme:DefaultTheme = {
    textColor: black;
    bgColor: white;

    colors: {
        main: @@;
        pages: @@;
    }
}

export const darkTheme:DefaultTheme = {
    textColor: white;
    bgColor: black;

    colors: {
        main: @@;
        pages: @@;
    }
}
```

< index.tsx >

- ThemeProvider는 어떤 Theme(테마) object를 필요로함
- ThemeProvider안에 감싸진 컴포넌트는 Theme object에 접근가능

```
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./theme";

<ThemeProvider theme={lightTheme}>
    <App />
</ThemeProvider>
```

https://styled-components.com/docs/api#typescript
