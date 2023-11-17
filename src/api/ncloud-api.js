import CryptoJS from "crypto-js";

export async function registerDeviceToken(userId, token) {
    const timestamp = new Date().getTime().toString();
    const ncloud_api_options = {
        "method":"POST",
        "headers": {
          "Accept":"*/*",
          "Content-Type":"application/json; charset=utf-8",
          "x-ncp-apigw-timestamp":timestamp,
          "x-ncp-iam-access-key":process.env.REACT_APP_NCLOUD_ACCESS_KEY,
          "x-ncp-apigw-signature-v2":makeSignature("POST", "users", timestamp)
        },
        "body":JSON.stringify({
            "userId":userId,                // 사용자 아이디(사용자를 식별하는 아이디)
            "deviceType":"GCM",             // 디바이스 타입(GCM: Android, APNS: iOS)
            "deviceToken":token,            // 디바이스 토큰
            "isNotificationAgreement":true, // 푸시 알림 메시지 수신여부(false 시 모든 메시지 미수신)
            "isAdAgreement":false,          // 광고성 메시지 수신여부(messageType: AD)
            "isNightAdAgreement":false      // 야간 광고성 메시지 수신여부(messageType: AD)(야간 - 오후 9시 ~ 익일 오전 8시)
        })
    };
    
    const response = await fetch(`${process.env.REACT_APP_NCLOUD_PUSH_API_ENDPOINT}/users`, ncloud_api_options);
    return response.ok;
}

export async function removeDeviceToken(userId) {
    const timestamp = new Date().getTime().toString();
    const ncloud_api_options = {
        "method":"DELETE",
        "headers": {
          "Accept":"*/*",
          "Content-Type":"application/json; charset=utf-8",
          "x-ncp-apigw-timestamp":timestamp,
          "x-ncp-iam-access-key":process.env.REACT_APP_NCLOUD_ACCESS_KEY,
          "x-ncp-apigw-signature-v2":makeSignature("DELETE", `users/${userId}`, timestamp)
        }
    };

    const response = await fetch(`${process.env.REACT_APP_NCLOUD_PUSH_API_ENDPOINT}/users/${userId}`, ncloud_api_options);
    return response.ok;
}

export async function registerSchedule(scheduleCode) {
    const timestamp = new Date().getTime().toString();
    const ncloud_api_options = {
        "method":"POST",
        "headers": {
          "Accept":"*/*",
          "Content-Type":"application/json; charset=utf-8",
          "x-ncp-apigw-timestamp":timestamp,
          "x-ncp-iam-access-key":process.env.REACT_APP_NCLOUD_ACCESS_KEY,
          "x-ncp-apigw-signature-v2":makeSignature("POST", "messages", timestamp)
        },
        "body":JSON.stringify({
            "target":{
                "type":"ALL"
            },                
            "message": {
                "default": {
                    "content": "복습할 내용이 도착하였습니다. 오늘도 파이팅 하세요~!😊"
                }
            },
            "scheduleCode": scheduleCode
        })
    };

    const response = await fetch(`${process.env.REACT_APP_NCLOUD_PUSH_API_ENDPOINT}/messages`, ncloud_api_options);
    return response.ok;
}

export async function printSignature() {
    const timestamp = new Date().getTime().toString();
    console.log(timestamp);
    console.log(makeSignature("POST", "messages", timestamp));
}

function makeSignature(method, path, timestamp) {
    var space = " ";                  // one space
    var newLine = "\n";               // new line

    var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, process.env.REACT_APP_NCLOUD_SECRET_KEY);
    hmac.update(method);
    hmac.update(space);
    hmac.update(`${process.env.REACT_APP_NCLOUD_PUSH_API_ENDPOINT}/${path}`);
    hmac.update(newLine);
    hmac.update(timestamp);
    hmac.update(newLine);
    hmac.update(process.env.REACT_APP_NCLOUD_ACCESS_KEY);
  
    var hash = hmac.finalize();
    return hash.toString(CryptoJS.enc.Base64);
}