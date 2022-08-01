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

`메인 화면 기능` `포토 갤러리 관련 기능` `사진 관련 기능` `댓글 기능` `좋아요 기능`
</br>
`미션 관련 기능` `배지 관련 기능` `가족 검색기능` 
</br>
`카카오 로그인` `소켓 실시간 알림` `음성 파일 변환기능`
</br>
`배포환경 구축(AWS)` `Nginx 프록시서버 설치` `https 적용` `Nginx 로드밸런싱`

#### 김준호

`캘린더 기능` `보이스 갤러리` `음성 메시지 기능` `소켓 실시간 알림`
<br/>
`Nginx 프록시 서버 설치` `https 적용`
<br/>
`CI/CD 세팅(Github Action)` `Nginx 로드밸런싱` `스트레스 테스트` 
<br/>
`로그인` `회원가입` `가족 관련 기능` `프로필 관련 기능` 
<br/>
`카카오 로그인` `소켓 실시간 알림` `스트레스 테스트`

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
  * 해결 방안 (1)
    - AWS의 ELB를 사용하여 EC2를 그룹화한 로드밸런싱 구현(EC2 자체를 늘리는 방식)
  * 해결 방안 (2)
    - 기존에 프록시 서버용으로 설치해놓은 Nginx를 로드밸런서로 활용하여 구현(하나의 EC2에 여러개의 서버를 연결하는 방식) 
  * 의사 결정
    - Nginx를 활용한 로드밸런싱 구현을 결정
    - 현재 진행하고있는 프로젝트의 사이즈와, 서비스를 이용하는 유저의 수, 그리고 비용적인 면을 고려했을때 ELB를 사용할 필요가 없다고 판단 
    - Artillery 라이브러리를 활용하여 로드밸런싱 전/후 서버의 성능(속도)을 파악하기 위한 스트레스 테스트를 진행하기로 함
  * 결과
    - 하나의 EC2 인스턴스에 3개의 서버를 연결하여 2개의 서버로 부하를 분산시키고 1개의 서버는 백업용 서버로 설정함
    - 스트레스 테스트 결과, 로드밸런싱 적용 후 1000명의 가상 사용자가 50번의 요청을 보낼 때, 평균 응답시간 감소 확인
      <p><img src="https://user-images.githubusercontent.com/100390926/171372869-f6098d30-4318-4fed-acc7-96b17b8da9f7.png" /></p>
</details>
