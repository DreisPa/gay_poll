function submitAnswer(answer) {
    fetch('/poll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('yesCount').innerText = data.yes || 0;
        document.getElementById('noCount').innerText = data.no || 0;
    })
    .catch(error => console.error('Ошибка:', error));
}

// Получение начальных данных
fetch('/poll')
    .then(response => response.json())
    .then(data => {
        document.getElementById('yesCount').innerText = data.yes || 0;
        document.getElementById('noCount').innerText = data.no || 0;
    })
    .catch(error => console.error('Ошибка:', error));


