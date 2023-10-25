import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import CryptoJS from "crypto-js";

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

export default async function alarm() {
    const permission = await Notification.requestPermission();
    if (permission === "denied") {
      console.log("알림 권한 허용 안됨");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPID_KEY,
    });
  
    registerDeviceTokenInNaverCloud(token);

    onMessage(messaging, (payload) => {
      console.log("메시지가 도착했습니다.", payload);
    });
};

function registerDeviceTokenInNaverCloud(token) {
    const timestamp = new Date().getTime().toString();
    const ncloud_api_options = {
        "method":"POST",
        "headers": {
          "Accept":"*/*",
          "Content-Type":"application/json; charset=utf-8",
          "x-ncp-apigw-timestamp":timestamp,
          "x-ncp-iam-access-key":process.env.REACT_APP_NCLOUD_ACCESS_KEY,
          "x-ncp-apigw-signature-v2":makeSignature(timestamp)
        },
        "body":JSON.stringify({
            "userId":"chucoding",           // 사용자 아이디(사용자를 식별하는 아이디)
            "deviceType":"GCM",             // 디바이스 타입(GCM: Android, APNS: iOS)
            "deviceToken":token,            // 디바이스 토큰
            "isNotificationAgreement":true, // 푸시 알림 메시지 수신여부(false 시 모든 메시지 미수신)
            "isAdAgreement":false,          // 광고성 메시지 수신여부(messageType: AD)
            "isNightAdAgreement":false      // 야간 광고성 메시지 수신여부(messageType: AD)(야간 - 오후 9시 ~ 익일 오전 8시)
        })
    };

    fetch(`${process.env.REACT_APP_NCLOUD_PUSH_API_ENDPOINT}/users`, ncloud_api_options);

    function makeSignature(timestamp) {
      console.log(timestamp);
      var space = " ";                  // one space
      var newLine = "\n";               // new line
      var method = "POST";              // method
  
      var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, process.env.REACT_APP_NCLOUD_SECRET_KEY);
      hmac.update(method);
      hmac.update(space);
      hmac.update(`${process.env.REACT_APP_NCLOUD_PUSH_API_ENDPOINT}/users`);
      hmac.update(newLine);
      hmac.update(timestamp);
      hmac.update(newLine);
      hmac.update(process.env.REACT_APP_NCLOUD_ACCESS_KEY);
    
      var hash = hmac.finalize();
      console.log(hash.toString(CryptoJS.enc.Base64));
      return hash.toString(CryptoJS.enc.Base64);
  }
}