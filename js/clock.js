
function updateClock() {
  const clockElement = document.getElementById('wita-clock');
  if (clockElement) {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Makassar',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const witaTime = new Intl.DateTimeFormat('en-GB', options).format(now);
    clockElement.textContent = witaTime;
  }
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to display the clock immediately
updateClock();
