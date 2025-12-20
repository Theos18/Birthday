let celebrationTriggered = false;

function updateCountdown() {
    const now = new Date();
    // Target: Dec 20, 2025 at 00:00:00
    const targetDate = new Date(2025, 11, 20, 0, 0, 0); 
    
    const diff = targetDate - now;
    
    if (diff <= 0) {
        // Birthday has arrived!
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
        
        if (!celebrationTriggered) {
            celebrationTriggered = true;
            // Wait 1.5 seconds so user sees the 00:00:00 timer before chaos starts
            setTimeout(triggerCelebration, 1500);
        }
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

function triggerCelebration() {
    // 1. Start Confetti immediately
    startConfetti();

    // Audio is already playing from the start click, but ensure it's playing
    const audio = document.getElementById('birthday-song');
    if (audio.paused) {
        audio.play().then(() => {
            document.getElementById('play-btn').innerText = '⏸';
        }).catch(e => console.log("Audio play failed (user interaction needed):", e));
    }

    // 2. Show Overlay and Blur Background after 2 seconds (give time for confetti)
    setTimeout(() => {
        document.getElementById('main-container').classList.add('blur-background');
        const overlay = document.getElementById('birthday-overlay');
        overlay.classList.remove('hidden');
        overlay.classList.add('visible');
    }, 2000);

    // 3. Start Balloons after 3 seconds (1 second after overlay)
    setTimeout(() => {
        startBalloons();
    }, 3000);

    // 4. Show "Next Important Event" button after balloons (e.g., 4 seconds)
    setTimeout(() => {
        const btn = document.getElementById('next-event-btn');
        btn.style.display = 'inline-block';
        // Add a small animation or fade in if desired, but display block is fine for now
    }, 4000);
}

// Event listener for the new button
document.getElementById('next-event-btn').addEventListener('click', () => {
    const audio = document.getElementById('birthday-song');
    if (audio) {
        audio.pause();
        audio.currentTime = 0; // Reset
    }
    window.location.href = 'krishna.html';
});

function startConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#FF69B4', '#FFB7C5', '#FFD700', '#FFF', '#00BFFF'];
    
    setInterval(() => {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random properties
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animDuration = Math.random() * 3 + 2; // 2-5s
        const size = Math.random() * 10 + 5;
        
        confetti.style.backgroundColor = bg;
        confetti.style.left = left + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        // Animation
        confetti.animate([
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${Math.random()*100 - 50}px, 100vh) rotate(${Math.random()*360}deg)`, opacity: 0 }
        ], {
            duration: animDuration * 1000,
            easing: 'linear',
            fill: 'forwards'
        });
        
        container.appendChild(confetti);
        
        // Cleanup
        setTimeout(() => {
            confetti.remove();
        }, animDuration * 1000);
        
    }, 50); // Create new confetti every 50ms
}

function startBalloons() {
    const container = document.getElementById('balloons-container');
    const colors = ['#FF69B4', '#FFB7C5', '#FF1493', '#DB7093'];
    
    setInterval(() => {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon-effect');
        
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const drift = Math.random() * 100 - 50; // -50 to 50px drift
        
        balloon.style.backgroundColor = bg;
        balloon.style.left = left + 'vw';
        balloon.style.setProperty('--drift', drift + 'px');
        
        // Randomize size slightly
        const scale = Math.random() * 0.5 + 0.8;
        balloon.style.transform = `scale(${scale})`;
        
        container.appendChild(balloon);
        
        // Cleanup (animation duration is 10s)
        setTimeout(() => {
            balloon.remove();
        }, 10000);
        
    }, 300); // Create new balloon every 300ms
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
