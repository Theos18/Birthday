function updateCountdown() {
    const now = new Date();
    
    // Get current time in IST
    // IST is UTC + 5.5 hours
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(now.getTime() + istOffset); // This is "local" time shifted to IST numbers but still UTC object technically if we read .getUTC... 
    // Better approach: Work with timestamps.
    
    // We want to find the next 00:00:00 IST.
    // Let's get the current time in IST string to parse components
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(now);
    
    // Extract current IST date parts
    // This is a bit complex to reconstruct a date object.
    
    // Simpler approach:
    // 1. Get current UTC time.
    // 2. Add 5h 30m to get "IST time" as if it were UTC.
    // 3. Set hours/min/sec to 0 for the NEXT day.
    // 4. Subtract 5h 30m to get back to real UTC timestamp of the target.
    
    const nowUtc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const currentIstTime = nowUtc + (330 * 60000); // 330 mins = 5.5 hours
    
    const currentIstDate = new Date(currentIstTime);
    
    // Target is tomorrow at 00:00:00
    const targetIstDate = new Date(currentIstDate);
    targetIstDate.setDate(currentIstDate.getDate() + 1);
    targetIstDate.setHours(0, 0, 0, 0);
    
    // Convert target IST back to UTC timestamp to compare with current UTC
    const targetTime = targetIstDate.getTime() - (330 * 60000);
    
    const diff = targetTime - nowUtc;
    
    if (diff <= 0) {
        // Birthday has arrived!
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
        return;
    }
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
    document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
}

setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Music Player Logic
const audio = document.getElementById('birthday-song');
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = '⏸'; // Pause icon
    } else {
        audio.pause();
        playBtn.innerText = '▶'; // Play icon
    }
});

audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
});

// Click on progress bar to seek
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener('ended', () => {
    playBtn.innerText = '▶';
    progressBar.style.width = '0%';
});
