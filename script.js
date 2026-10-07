const progressBar = document.querySelector('#progressBar');
const progressFill = document.querySelector('.progress-bar__fill');
const playButton = document.querySelector('#playButton');
const timeText = document.querySelector('#timeText');
const percentText = document.querySelector('#percentText');
const video = document.querySelector('#inductionVideo');
const acceptance = document.querySelector('#acceptance');
const examButton = document.querySelector('#examButton');
const examMessage = document.querySelector('#examMessage');
const surveyUrl = 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=zuUHBZUPqkmr3skNze29ElOjFgu7mytAnK-6a_aNM19URUdUUjNETExQUlZJWFYzWUhQUjA3U1BaTS4u';

let duration = 0;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function updateExamState() {
  const videoComplete = duration > 0 && video.currentTime >= duration - 1;
  const ready = videoComplete && acceptance.checked;
  examButton.disabled = !ready;

  if (ready) {
    examButton.textContent = 'Ingresar al examen';
    examMessage.textContent = 'Todo listo: ya puedes presentar el examen.';
  } else if (videoComplete) {
    examButton.textContent = 'Acepte los lineamientos para habilitar';
    examMessage.textContent = 'Solo falta aceptar los lineamientos anteriores.';
  } else {
    examButton.textContent = 'Complete el video y acepte los lineamientos';
    examMessage.textContent = 'El examen se habilitará al completar la inducción.';
  }
}

function renderProgress() {
  const percentage = duration ? Math.round((video.currentTime / duration) * 100) : 0;
  progressFill.style.width = `${percentage}%`;
  progressBar.setAttribute('aria-valuenow', percentage);
  timeText.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
  percentText.textContent = `${percentage}%`;
  updateExamState();
}

function pause() {
  video.pause();
  playButton.textContent = '▶';
  playButton.setAttribute('aria-label', 'Reproducir inducción');
}

function play() {
  if (video.ended) video.currentTime = 0;
  video.play();
}

playButton.addEventListener('click', () => (video.paused ? play() : pause()));
video.addEventListener('loadedmetadata', () => { duration = video.duration; renderProgress(); });
video.addEventListener('timeupdate', renderProgress);
video.addEventListener('play', () => { playButton.textContent = '❚❚'; playButton.setAttribute('aria-label', 'Pausar inducción'); });
video.addEventListener('pause', () => { playButton.textContent = '▶'; playButton.setAttribute('aria-label', 'Reproducir inducción'); });
video.addEventListener('ended', () => { renderProgress(); updateExamState(); });
acceptance.addEventListener('change', updateExamState);
examButton.addEventListener('click', () => {
  const examWindow = window.open(surveyUrl, '_blank', 'noopener,noreferrer');
  if (!examWindow) {
    examMessage.textContent = 'El navegador bloqueó la nueva ventana. Permite las ventanas emergentes e inténtalo de nuevo.';
  }
});

renderProgress();
