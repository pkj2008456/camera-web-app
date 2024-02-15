var frontCamera = false;
var currentStream;

// 定義常數
// 獲取文檔中id為"camera-view"、"camera-device"、"photo-display"、"take-photo-button"和"front-camera-button"的元素
const
    cameraView = document.querySelector("#camera-view"), // 相機視圖
    cameraDevice = document.querySelector("#camera-device"), // 相機設備
    photoDisplay = document.querySelector("#photo-display"), // 照片顯示
    takePhotoButton = document.querySelector("#take-photo-button"), // 拍照按鈕
    frontCameraButton = document.querySelector("#front-camera-button"); // 前置攝像頭按鈕

// 訪問設備相機並將其流式傳輸到cameraDevice
function cameraStart() {
    // 在訪問媒體設備之前停止視頻流
    if (typeof currentStream !== 'undefined') {
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
    }// 檢查用戶相機權限

    // 設置視頻流的限制條件
    // 如果frontCamera為true，使用前置攝像頭
    // 否則使用後置攝像頭
    // "user" => 前置攝像頭
    // "environment" => 後置攝像頭
    var constraints = { video: { facingMode: (frontCamera? "user" : "environment") }, audio: false };
    
    // 訪問媒體設備，例如相機
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            currentStream = stream;
            cameraDevice.srcObject = stream;
        })
        .catch(function(error) {
            console.error("發生錯誤。", error);
        });
}
// 如果點擊takePhotoButton => 拍照並顯示照片
takePhotoButton.onclick = function() {
    cameraView.width = cameraDevice.videoWidth;
    cameraView.height = cameraDevice.videoHeight;
    cameraView.getContext("2d").drawImage(cameraDevice, 0, 0);
    photoDisplay.src = cameraView.toDataURL("image/webp");
    photoDisplay.classList.add("photo-taken");
};

// 如果點擊前/後攝像頭 => 根據點擊切換到前/後攝像頭
frontCameraButton.onclick = function() {
    // 切換frontCamera變量的值
    frontCamera = !frontCamera;
    // 設置按鈕文本
    if (frontCamera) {
        frontCameraButton.textContent = "Back Camera";
    }
    else {
        frontCameraButton.textContent = "Front Camera";
    }
    // 開始視頻流
    cameraStart();
};

// 窗口加載時啟動相機和視頻流
// 第一個參數：事件類型
// 第二個參數：事件發生時要調用的函數
window.addEventListener("load", cameraStart);
