async function fetchData() {
    try {
        const response = await fetch('http://localhost:8080'); // '/' 경로로 API 호출
        const data = await response.text(); // '헬로월드!!' 메시지를 텍스트로 받음
        displayData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; // 기존 내용을 지움
    const div = document.createElement('div');
    div.textContent = data; // 응답 데이터를 div에 추가
    container.appendChild(div);
}

document.addEventListener('DOMContentLoaded', fetchData);
