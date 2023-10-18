import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import ReactMarkdown from 'react-markdown';
import Annotation from './modules/Annotation';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "til-alarm.firebaseapp.com",
  projectId: "til-alarm",
  storageBucket: "til-alarm.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

(async function () {
  console.log("권한 요청 중...");

  const permission = await Notification.requestPermission();
  if (permission === "denied") {
    console.log("알림 권한 허용 안됨");
    return;
  }

  console.log("알림 권한이 허용됨");

  const token = await getToken(messaging, {
    vapidKey: process.env.REACT_APP_VAPID_KEY,
  });

  if (token) console.log("token: ", token); // SENS PUSH API를 사용하기 위한 device token
  else console.log("Can not get Token");

  onMessage(messaging, (payload) => {
    console.log("메시지가 도착했습니다.", payload);
  });
})();

const ONE_DAY_AGO = 1;
const ONE_WEEK_AGO = 7;
const ONE_MONTH_AGO = 30;

function App() {

  const [contents, setContents] = useState({ONE_DAY_AGO:{}, ONE_WEEK_AGO:{}, ONE_MONTH_AGO:{}});

  const getData = (day) => {
    fetch("")
    .then(res=>res.json())
    .then(data => {
      setContents(...contents, {day:data})
    })
  }

  useEffect(()=>{
    getData(ONE_DAY_AGO);
    getData(ONE_WEEK_AGO);
    getData(ONE_MONTH_AGO);
  }, []);

  return (
    <div>
      <Annotation text="/* Day1 */" />
      <ReactMarkdown>
      {contents[ONE_DAY_AGO]}
      </ReactMarkdown>
      <Annotation text="/* Day7 */" />
      <ReactMarkdown>
      {contents[ONE_WEEK_AGO]}
      </ReactMarkdown>
      <Annotation text="/* Day30 */" />
      <ReactMarkdown>
      {contents[ONE_MONTH_AGO]}
      </ReactMarkdown>
    </div>
  );
}

export default App;
