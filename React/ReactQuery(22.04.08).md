# React Query

React 애플리케이션에서 서버 state를 fetching, caching, synchronizing, updating할 수 있도록 도와주는 라이브러리
"global state"를 건드리지 않고 React 및 React Native 애플리케이션에서 데이터를 가져오고, 캐시하고, 업데이트함.

```
//Import "react-query"
import { QueryClient, QueryClientProvider } from "react-query";

// Create a client
const queryClient = new QueryClient();

// Provide the client to your App
<QueryClientProvider client={queryClient}>
    <App />
</QueryClientProvider>
```

https://react-query.tanstack.com/quick-start

# Queries

쿼리는 서버에서 데이터를 가져오기 위해 모든 Promise 기반 메서드(GET 및 POST 메서드 포함)와 함께 사용할 수 있다. 제공한 고유 키는 애플리케이션 전체에서 쿼리를 다시 가져오고, 캐싱하고, 공유하는 데 내부적으로 사용됨. useQuery에서 반환된 쿼리 결과에는 템플릿 및 기타 데이터 사용에 필요한 쿼리에 대한 모든 정보가 포함되어 있다.
ex) const result = useQuery('todos', fetchTodoList)
https://react-query.tanstack.com/guides/queries
https://react-query.tanstack.com/reference/useQuery#_top

# Query Key

React Query는 쿼리 키를 기반으로 쿼리 캐싱을 관리
https://react-query.tanstack.com/guides/query-keys
