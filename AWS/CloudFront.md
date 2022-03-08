# AWS 서비스 중 CloudFront 설정하는 방법

## [CloudFront](https://aws.amazon.com/ko/cloudfront/)

- AWS에서 제공하는 CDN(Content Delivery Network, Content Distribution Network, 콘텐츠 전송 네트워크)
- 캐싱을 통해 사용자에게 좀 더 빠른 전송 속도를 제공
- CloudFront는 전 세계에 Edge Server(Location)을 두고 Client에 가장 가까운 Edge Server를 찾아 Latency를 최소화시켜 빠른 데이터를 제공
  = CloudFront를 통해 서비스하는 콘텐츠를 사용자가 요청하면 지연 시간이 가장 낮은 Edge Server(Location)으로 라우팅되므로 콘텐츠 전송 성능이 빠르다.
- 캐시서버라서 그 안쪽에 있는 서버를 숨길 수 있는 은익화의 효과가 있다

<hr />

### 키워드

- CDN : 콘텐츠를 효율적 전달을 위해 여러 노드를 가진 네트워크에 데이터를 저장하여 제공하는 시스템, 인터넷 서비스 제공자(ISP,Internet Service Provider)에 직접 연결되어 데이터를 전송하여 콘텐츠 병목을 피할 수 있다.
- Origin Server : 원본 데이터를 갖고 있는 서버. 보통 AWS에서의 Origin Server는 S3, Ec2 instance
- Edge Server (= Edge Location) : AWS에서 실질적으로 제공하는 전 세계에 퍼져있는 서버. Edge Server에는 요청받은 데이터에 같은 요청에 대해서 빠르게 응답해주기 위해 Cache 기능을 제공.

<hr />

### 데이터 전송이 발생하는 과정

1. Client로부터 데이터 전송 요청

2. 콘텐츠(=데이터)가 지연시간이 가장 낮은 Edge Server가 있는 경우, 콘텐츠를 즉시 제공

- Edge Server는 요청이 발생한 데이터에 대하여 캐싱 여부를 확인
- 사용자의 근거리에 위치한 Edge Server 중 캐싱 데이터가 존재한다면 사용자의 요청에 맞는 데이터를 응답

3. 콘텐츠(=데이터)가 Edge Server에 없는 경우, 콘텐츠의 최종 버전에 대한 소스로 지정된 Origin Server(Amazon S3 버킷, MediaPackge 채널, HTTP 서버 등)에서 콘텐츠를 검색

- 사용자의 요청에 적합한 데이터가 캐싱되어 있지 않은 경우 Origin Server로 요청
- 요청받은 데이터에 대해 Origin Server에서 획득한 후 Edge Server에 캐싱 데이터를 생성하고, Client로 응답이 발생

<hr />

### Edge Server의 Cache는 무슨 특징?

- 기본적으로 한번 발생한 요청에 대해서는 Edge Server에 캐싱된 상태로 저장

- Edge Server의 기본 TTL은 24시간이고 사용자의 설정에 따라 변경이 가능 (TTL 수정 시 Edge Server에 반영되는 시간이 소요됨)

- 이러한 캐시의 설정 후 반영 시간 때문에 전체 데이터에 대한 TTL을 수정하는 게 아닌 각 개별 데이터에 대해서 invalidation API(특정 파일을 캐시에서 삭제하는 기능)을 통해 삭제할 수 있다

- Invalidation API는 동시에 최대 3개의 요청을 발생시킬 수 있으며, 각 요청은 최대 1000개까지 가능

- Invalidation API는 Edge Node에 반영되기까지 5~10분 정도의 시간이 소요

<hr />

[설정방법1](https://brunch.co.kr/@topasvga/94)
[설정방법2](https://real-dongsoo7.tistory.com/87?category=776053)
