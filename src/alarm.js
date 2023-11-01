import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { registerDeviceToken, registerSchedule } from "./api/ncloud-api";

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
  
    const isOk = registerDeviceToken(process.env.REACT_APP_USER_ID, token);
    if (isOk) {
      registerSchedule(process.env.REACT_APP_USER_ID, process.env.REACT_APP_SCHEDULE_CODE);
    }
    
    onMessage(messaging, (payload) => {
      console.log("메시지가 도착했습니다.", payload);
    });
};

