# 온라인으로 공부하고 싶다면? 👨‍Stupy
![그림11](https://blog.kakaocdn.net/dn/cCqYjw/btrII12IHL1/8kIz1BK1UT8eveJk997OM1/img.png)

<br>

## 📌 바로가기
- 사이트 바로가기 : https://www.stupy.co.kr
- 프론트엔드 GitHub Repository : x
- 백엔드 GitHub Respository : https://github.com/ConfusedPandaEvan/study_people
- 시연 영상 보러가기: x
- 발표 영상 보러가기: x

<br>

## ⏱ 프로젝트 기간
> 2022.06.24 ~ 2022.08.5 (6주)

<br>

## 👾 BACKEND MEMBERS
#### 임현우 

`스터디룸 CRUD` `Todo & Todo List CRUD` `CICD 환경 구축` `https 적용` 
</br>
`Multer 이미지 관리` `배포환경 구축(AWS)` `통합 & 해시태그 검색기능` 
</br>
 `정렬 기능` `목업 디자인` 

#### 김준호

`AWS ECS` `EC2 Redis-Server` 
<br/>
`타이머 기능` `채팅기능` `화상채팅기능` `소켓관리` `Redis-Adaptor` 
<br/>
`소켓 미들웨어` `컨트롤러 GUARD`
<br/>
`로그인` `소셜로그인기능` `카카오톡로그인` `네이버로그인` 
<br/>


<br>

## 🌈 스투피 서비스 주요기능
<p6> 🔥 스투피는 반응형으로 웹과 모바일 모두 이용 가능한 서비스입니다.</p6>
#### 🔔 자신이 원하는 목적의 스터디 그룹 개설
#### 🔔 자신과 목적이 같은 스터디 그룹 검색 (키워드 및 해시태그 검색) & 참여
#### 🔔 공부 목표 관리를 위한 개인 Todo List 관리
#### 🔔 실시간 화상 및 채팅이 가능한 스터디 그룹
#### 🔔 스터디 룸에서 자신이 공부한 시간 측정 및 경쟁 

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb0vTqK%2FbtrIEYyXZgk%2FJjYuPPCwbBOx1Bxx1gYocK%2Fimg.png">

<br>

## ✨ 아키텍쳐
<br>

![스투피_최종아키텍처_피드백후](https://blog.kakaocdn.net/dn/dGq0X9/btrIH7a2hMa/BrFHGtydDhBctqu3w8UVsk/img.png)

<br>

## 🔨 기술스택
### **Tech**
<p>
<img src='https://img.shields.io/badge/javascript-F7DF1E?logo=javascript'/>
<img src='https://img.shields.io/badge/Node-version16.13.1-green?logo=Node.js'/>
<img src='https://img.shields.io/badge/Express-v4.17.13-black?logo=Express'/>
<img src='https://img.shields.io/badge/MongoDB-version111-green?logo=mongodb'/>
<br>
<img src='https://img.shields.io/badge/socket.io-v4.4.1-white?logo=Socket.io'/>
<img src='https://img.shields.io/badge/prettier-v2.5.1-pink?logo=prettier'/>
<img src="https://img.shields.io/badge/Passport-v0.5.2-34E27A?logo=Passport&logoColor=white" />
<img src="https://img.shields.io/badge/JsonWebToken-v8.5.1-8a8a8a?logo=JSON Web Tokens&logoColor=white" />
<img src="https://img.shields.io/badge/Git hub-000000?logo=Github&logoColor=white" />
<img src="https://img.shields.io/badge/PM2-000000?logo=PM2&logoColor=white" />
<br>
</p>

<br>

## 📚 라이브러리 
| name                | Appliance               | version  |
| :-----------------: | :---------------------: | :------: |
| cors                | CORS 핸들링             |2.8.5|
| mongoose            | MongoDB ODM             |6.1.1|
| jsonwebtoken        | JWT토큰 발급            |8.5.1|
| multer              | 파일 업로드             |1.4.4|
| socket.io           | 실시간 알림             |4.5.1|
| jest                | 테스트코드             |28.0.1|


<br>
   
## 🚀 기술적 도전 및 트러블 슈팅
### ✅ 서버 성능 개선
* 도입 이유
    - 서버의 부하를 분산시키고 안정적인 서버 유지를 위해 로드밸런싱 구현의 필요성을 느낌
  * 문제 상황
    - socket 연결을 통해 실시간 알림기능을 제공하고 있기 때문에 접속자 수 증가에 따라 서버의 부담 증가
  * 해결 방안 
    - AWS의 ELB를 사용하여 EC2를 그룹화한 로드밸런싱 구현(EC2 자체를 늘리는 방식)
  * 결과
    - 현재 진행중
### ✅ 여러대의 서버간의 통신기능 개선
* 도입 이유
    - 여러대의 서버로 접속하는 소켓들을 하나로 관리하여 EVENTS 를 EMIT 해주어야 될 필요성을 느낌
  * 문제 상황
    - 한대의 서버에서 다른서버로 SOCKET 정보를 보내 줄 방법이 필요함
  * 해결 방안 
    - 한개의 WATCHER 서버에서 REDIS 를 사용하고 다른 서버들이 REDIS 서버를 통해 이벤트를 SUB/PUB 하는 방식을 
  * 결과
    - 현재 진행중
