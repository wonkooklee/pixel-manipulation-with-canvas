# Pixel Manipulation with Canvas API

With the ImageData object we can directly read and write a data array to manipulate pixel data.

[MEDIUM: Canvas API와 Broadcast Channel API를 이용한 자필 서명 이미지 생성 모듈 구현기 - Part.1 (Korean)](https://www.blog.kcd.co.kr/canvas-api%EC%99%80-broadcast-channel-api%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%9E%90%ED%95%84-%EC%84%9C%EB%AA%85-%EB%AA%A8%EB%93%88-%EA%B5%AC%ED%98%84%EA%B8%B0-part-1-5013e4ad8804)

## Instructions

Install dependencies.

```bash
$ npm install
$ npm i
```

Start live-server with following script.

```bash
$ npm start
```

The script above will compile `.ts` to `.js` and run the live-server on localhost on port `4000`.

You can change serving port within `server.js` configurations.

```js
const params = {
  port: 4000, // <- here
  host: "0.0.0.0",
  open: true,
  root: "src",
};
```

## Features to demonstrate

### Parsing Pixels

<img width="300" alt="Screen Shot 2023-04-11 at 11 39 33 PM-min" src="https://user-images.githubusercontent.com/61101022/231198904-62240ee5-bfa7-4f62-beb5-2b8d9ea0d363.png">

### Cropping Image

<img width="300" alt="Screen Shot 2023-04-11 at 11 40 19 PM-min" src="https://user-images.githubusercontent.com/61101022/231198919-85ccc8ad-ebf6-4873-b24d-af0c2ec18984.png">


Thanks!

© Wonkook Lee
