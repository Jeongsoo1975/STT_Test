let mediaRecorder;
let audioChunks = [];

document.getElementById('recordBtn').addEventListener('click', async () => {
    const button = document.getElementById('recordBtn');
    
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = (e) => {
                audioChunks.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const formData = new FormData();
                formData.append('audio', audioBlob, 'recording.wav');

                // Heroku 백엔드로 전송
                try {
                    button.textContent = "변환 중...";
                    const response = await fetch('https://your-heroku-app.herokuapp.com/stt', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    document.getElementById('result').textContent = result.text;
                } catch (err) {
                    document.getElementById('result').textContent = "오류 발생! 다시 시도해주세요.";
                }
                button.textContent = "🎤 음성 녹음";
                audioChunks = [];
            };

            mediaRecorder.start();
            button.textContent = "⏹ 녹음 중지";
        } catch (err) {
            alert("마이크 접근 권한이 필요합니다!");
        }
    } else {
        mediaRecorder.stop();
        button.textContent = "🎤 음성 녹음";
    }
});
