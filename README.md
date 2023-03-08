# Meeting

### Let's Meeting, let's be together

Meeting is a real-time video conferencing web app featuring hand pose detection, which provides a lot of fun during meetings.

- demo website: https://jaywang-project.com/
- test account and password: (test@test.com, 123456789a)

![](https://i.imgur.com/gbLn7dt.png)

## Catelog

- [Features](#Features)
- [System Architecture](#System-Architecture)
  - [System Design](#System-Design)
  - [Communication](#Communication)
- [Backend Technique](#Backend-Technique)
  - [Key Points](#Key-Points)
  - [Infrastructure](#Infrastructure)
  - [Environment](#Environment)
  - [Database](#Database)
  - [Database Schema](#Database-Schema)
  - [Networking](#Networking)
  - [Unit Test](#Unit-Test)
- [Frontend Technique](#Frontend-Technique)
  - [React Component Design](#React-Component-Design)
  - [React Router](#React-Router)
  - [Redux (redux-toolkit)](#Redux-redux-toolkit)
  - [WebRTC](#WebRTC)
- [Cloud Services](#Cloud-Services)
- [Version Control](#Version-Control)
- [CI/CD](#CI-CD)
- [Third Party Package](#Third-Party-Package)
- [API Doc](#API-Doc)
- [Contact](#Contact)

## Features<a name="Features"></a>

- Real-time video and audio streaming for your team

<img src="https://d26qu93gsa16ou.cloudfront.net/introPageUse/stream_demo.gif" />

- Real-time chat room for easy negotiation

<img src="https://d26qu93gsa16ou.cloudfront.net/introPageUse/chat_demo.gif" />

- Sharing screen to make your work more convenient
- Recording the stream allows you to keep a record of your meeting

<img src="https://d26qu93gsa16ou.cloudfront.net/introPageUse/sharing_recording_demo.gif" />

- Expressing your emotions through hand poses make the meeting more fun

<img src="https://d26qu93gsa16ou.cloudfront.net/introPageUse/tf_demo_2.gif" />
<img src="https://d26qu93gsa16ou.cloudfront.net/introPageUse/all_handpose.png" width="50%" style="display: block; margin: 0 auto;" />

- Sign in locally or use Google OAuth
- JWT authentication
- Support mobile devices so you can connect with others anywhere

## <a name="System-Architecture"></a>System Architecture

### <a name="System-Design"></a>System Design

![](https://i.imgur.com/OQ31uLj.png)

### <a name="Communication"></a>Communication

![](https://i.imgur.com/MbBiB7s.png)

## <a name="Backend-Technique"></a>Backend Technique

### <a name="Key-Points"></a>Key Points

- MVC pattern
- Websocket
- Self-trained Mobile-SSD model on TensorFlow for hand pose detection ([repo](https://github.com/Yjaywang/hand-pose-detection-practice))

### <a name="Infrastructure"></a>Infrastructure

- Docker-compose

### <a name="Environment"></a>Environment

- Node.js/Express.js

### <a name="Database"></a>Database

- MongoDB Atlas

### <a name="Database-Schema"></a>Database Schema

![](https://i.imgur.com/K0866Hh.png)

### <a name="Networking"></a>Networking

- HTTP & HTTPS
- Domain Name System (DNS)
- NGINX
- SSL (sslforfree)

### <a name="Unit-Test"></a>Unit Test

- mocha/chai

## <a name="Frontend-Technique"></a>Frontend Technique

### <a name="React-Component-Design"></a>React Component Design

![](https://i.imgur.com/1EqQbbF.png)

![](https://i.imgur.com/LMQrXjc.png)

![](https://i.imgur.com/iKqLhUZ.png)

![](https://i.imgur.com/8CWuMAu.png)

### <a name="React-Router"></a>React Router

- SPA routing

### <a name="Redux-redux-toolkit"></a>Redux (redux-toolkit)

- For global variables

### <a name="WebRTC"></a>WebRTC

![](https://i.imgur.com/sQe3v6V.png)

## <a name="Cloud-Services"></a>Cloud Services

- AWS EC2: as backend host machine
- AWS S3: store avatars and recordings
- AWS cloudfront: host React and TensorFlow model

## <a name="Version-Control"></a>Version Control

- Git/Github

## <a name="CI-CD"></a>CI/CD

- Git Action

## <a name="Third-Party-Package"></a>Third Party Package

- simple-peer-light
- recordrtc
- tensorflow/tfjs
- passport

## <a name="API-Doc"></a>API Doc

- [Link](https://app.swaggerhub.com/apis-docs/Yjaywang/Meeting/1.0.0#/user/userSignin)

## <a name="Contact"></a>Contact

- author: Jay Wang
- [LinkedIn](https://www.linkedin.com/in/%E8%A1%8D%E9%9C%96-%E7%8E%8B-51a934240/)
