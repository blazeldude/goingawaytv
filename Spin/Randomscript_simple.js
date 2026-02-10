let videos = [];
let watched = [];
let firstClick = true;
let autoplayEnabled = false;
let currentPlayer = null;
let currentPlatform = null;
let youtubeAPIReady = false;
let checkEndInterval = null;
let isSettingUpPlayer = false;
let currentVideoIndex = null;
let isAnimationPlaying = false;

const videoFrame = document.getElementById('videoFrame');
const randomBtn = document.getElementById('randomBtn'); // This is now a video element
const resumeBtn = document.getElementById('resumeBtn');
const autoplayBtn = document.getElementById('autoplayBtn');
const resetBtn = document.getElementById('resetBtn');
const videoTitle = document.getElementById('videoTitle');
const videoAuthor = document.getElementById('videoAuthor');
const authorLink = document.getElementById('authorLink');
const nowPlaying = document.getElementById('nowPlaying');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const fullscreenVideo = document.querySelector('.fullscreen-video');
const spinText = document.querySelector('.spin-text');


window.onYouTubeIframeAPIReady = function() {
  youtubeAPIReady = true;
  console.log('YouTube API Ready');
};


if (window.YT && window.YT.Player) {
  youtubeAPIReady = true;
  console.log('YouTube API was already ready');
}


randomBtn.addEventListener('click', function() {
  if (isAnimationPlaying) return; 
  isAnimationPlaying = true;
  randomBtn.style.pointerEvents = 'none'; 
  randomBtn.play();
});

randomBtn.addEventListener('ended', function() {
  isAnimationPlaying = false;
  randomBtn.style.pointerEvents = 'auto'; 
  
  randomBtn.classList.add('small');
  randomBtn.src = '../img/Spinningwheelsmall.webm';
  
  spinText.classList.add('hidden');
  
  fullscreenVideo.classList.add('playing');
  
  pickRandomVideo();
});

function loadProgress() {
  const savedWatched = localStorage.getItem('watchedVideos');
  const savedFirstClick = localStorage.getItem('firstClick');
  const savedCurrentVideo = localStorage.getItem('currentVideo');
  const savedAutoplayEnabled = localStorage.getItem('autoplayEnabled');
  
  if (savedWatched) {
    watched = JSON.parse(savedWatched);
  }
  
  if (savedFirstClick !== null) {
    firstClick = savedFirstClick === 'true';
  }
  
  if (savedAutoplayEnabled !== null) {
    autoplayEnabled = savedAutoplayEnabled === 'true';
    if (autoplayEnabled) {
      autoplayBtn.textContent = 'Autoplay: ON';
      autoplayBtn.style.background = 'rgba(30,255,0,0.8)';
    } else {
      autoplayBtn.textContent = 'Autoplay: OFF';
      autoplayBtn.style.background = 'rgba(255,255,255,0.3)';
    }
  }
  
  const savedCurrentVideoIndex = localStorage.getItem('currentVideo');
  if (savedCurrentVideoIndex) {
    const videoIndex = parseInt(savedCurrentVideoIndex);
    if (videoIndex >= 0 && videoIndex < videos.length) {
      console.log('Resume available for video index:', videoIndex);
      
      const container = document.querySelector('.button-container');
      container.style.top = '50%';
      container.style.left = '50%';
      container.style.bottom = 'auto';
      container.style.right = 'auto';
      container.style.transform = 'translate(-50%, -50%)';
      
      randomBtn.classList.add('disabled');
      resumeBtn.style.display = 'block';
      spinText.classList.add('hidden');
      fullscreenVideo.classList.remove('playing');
      
      firstClick = true;
    }
  }
  
  console.log('Progress loaded. Fresh start on page refresh');
}

function restoreVideo(videoIndex) {
  let video = videos[videoIndex];
  const embedUrl = convertToEmbedUrl(video.Link, video.Platform);

  console.log('=== RESTORE VIDEO DEBUG ===');
  console.log('Video index:', videoIndex);
  console.log('Video platform:', video.Platform);
  console.log('Embed URL:', embedUrl);

  videoFrame.src = embedUrl;
  
  setTimeout(() => {
    setupVideoEndDetection(video.Platform, embedUrl);
  }, 1000);

  videoTitle.textContent = video.Title;
  videoAuthor.textContent = video.Name;
  authorLink.href = video.Website;

  nowPlaying.style.display = 'block';

  randomBtn.classList.remove('disabled');
  randomBtn.classList.add('small');
  randomBtn.src = '../img/Spinningwheelsmall.webm';
  resumeBtn.style.display = 'none';
  spinText.classList.add('hidden');
  fullscreenVideo.classList.add('playing');

  moveButtonToCorner();
}

function saveProgress(currentVideoIndex) {
  localStorage.setItem('watchedVideos', JSON.stringify(watched));
  localStorage.setItem('firstClick', firstClick.toString());
  localStorage.setItem('autoplayEnabled', autoplayEnabled.toString());
  if (currentVideoIndex !== undefined) {
    localStorage.setItem('currentVideo', currentVideoIndex.toString());
  }
}

function clearProgress() {
  localStorage.removeItem('watchedVideos');
  localStorage.removeItem('firstClick');
  localStorage.removeItem('currentVideo');
  localStorage.removeItem('autoplayEnabled');
}

function convertToEmbedUrl(link, platform) {
  if (platform.toLowerCase() === 'vimeo') {
    let vimeoId, hash = '';
    
    const matchWithSlash = link.match(/vimeo\.com\/(\d+)\/([a-zA-Z0-9]+)/);
    if (matchWithSlash) {
      vimeoId = matchWithSlash[1];
      hash = matchWithSlash[2];
      return `https://player.vimeo.com/video/${vimeoId}?h=${hash}&autoplay=1&muted=0&byline=0&portrait=0&title=0&controls=0`;
    }
    
    const matchStandard = link.match(/vimeo\.com\/(\d+)/);
    if (matchStandard) {
      vimeoId = matchStandard[1];
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0&byline=0&portrait=0&title=0&controls=0`;
    }
  } else if (platform.toLowerCase() === 'youtube') {
    const youtubeId = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)?.[1];
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}?controls=0&autoplay=1&enablejsapi=1&rel=0&origin=${window.location.origin}`;
    }
  } else if (platform.toLowerCase() === 'other') {
    if (link.includes('autoplay=')) {
      return link.replace('autoplay=false', 'autoplay=true');
    }
    return link;
  }
  return link;
}

function cleanupPlayer() {
  if (checkEndInterval) {
    clearInterval(checkEndInterval);
    clearTimeout(checkEndInterval);
    checkEndInterval = null;
  }
  
  if (currentPlayer) {
    try {
      if (currentPlatform === 'vimeo' && currentPlayer.off) {
        currentPlayer.off('ended');
        currentPlayer.off('play');
        currentPlayer.off('pause');
      }
    } catch (e) {
      console.log('Error cleaning up player:', e);
    }
    currentPlayer = null;
  }
  
  isSettingUpPlayer = false;
}

function setupVideoEndDetection(platform, embedUrl) {
  if (isSettingUpPlayer) {
    console.log('Player setup already in progress, skipping duplicate call for:', platform);
    return;
  }
  
  isSettingUpPlayer = true;
  cleanupPlayer();
  currentPlatform = platform.toLowerCase();
  console.log('Setting up video end detection for:', currentPlatform, 'with URL:', embedUrl);
  
  if (currentPlatform === 'youtube') {
    setupYouTubePlayer();
  } else if (currentPlatform === 'vimeo') {
    setupVimeoPlayer();
  } else if (currentPlatform === 'other') {
    setupOtherPlayer();
  } else {
    console.log('Unknown platform:', currentPlatform, 'falling back to time-based detection');
    setupOtherPlayer();
  }
  
  setTimeout(() => {
    isSettingUpPlayer = false;
  }, 3000);
}

function setupYouTubePlayer() {
  if (!window.youtubeRetryCount) {
    window.youtubeRetryCount = 0;
  }
  
  if (!youtubeAPIReady) {
    console.log('YouTube API not ready yet, will retry...');
    window.youtubeRetryCount++;
    
    if (window.youtubeRetryCount >= 10) {
      console.log('YouTube API retry limit reached, giving up');
      isSettingUpPlayer = false;
      return;
    }
    
    window.youtubeRetryTimeout = setTimeout(setupYouTubePlayer, 500);
    return;
  }
  
  if (window.youtubeRetryTimeout) {
    clearTimeout(window.youtubeRetryTimeout);
  }
  
  try {
    currentPlayer = new YT.Player('videoFrame', {
      events: {
        'onStateChange': onYouTubeStateChange,
        'onError': onYouTubeError
      }
    });
    console.log('YouTube player setup complete');
    isSettingUpPlayer = false;
    window.youtubeRetryCount = 0;
  } catch (e) {
    console.log('Error setting up YouTube player:', e);
    isSettingUpPlayer = false;
  }
}

function onYouTubeError(event) {
  console.log('YouTube player error:', event.data);
  isSettingUpPlayer = false;
}

function onYouTubeStateChange(event) {
  if (event.data === 0) {
    console.log('YouTube video ended');
    onVideoEnded();
  }
  isSettingUpPlayer = false;
}

function setupVimeoPlayer() {
  if (currentPlatform !== 'vimeo') {
    console.log('WARNING: setupVimeoPlayer called but platform is:', currentPlatform, '- aborting');
    isSettingUpPlayer = false;
    return;
  }
  
  setTimeout(() => {
    try {
      if (typeof Vimeo === 'undefined') {
        console.log('Vimeo API not loaded yet, retrying...');
        setTimeout(setupVimeoPlayer, 1000);
        return;
      }
      
      currentPlayer = new Vimeo.Player(videoFrame);
      
      currentPlayer.on('ended', function() {
        console.log('Vimeo video ended');
        onVideoEnded();
      });
      
      currentPlayer.on('play', function() {
        console.log('Vimeo video started playing');
      });
      
      currentPlayer.on('pause', function() {
        console.log('Vimeo video paused');
        if (videoFrame.src.includes('controls=0')) {
          console.log('Controls disabled - treating pause as video end');
          onVideoEnded();
        }
      });
      
      currentPlayer.ready().then(function() {
        console.log('Vimeo player setup complete');
        isSettingUpPlayer = false;
      }).catch(function(error) {
        console.log('Vimeo player not ready:', error);
        isSettingUpPlayer = false;
      });
      
    } catch (e) {
      console.log('Error setting up Vimeo player:', e);
      isSettingUpPlayer = false;
    }
  }, 2000);
}

function setupOtherPlayer() {
  const videoDuration = (6 * 60 + 13) * 1000;
  
  console.log('Setting up OTHER player with duration:', videoDuration / 1000, 'seconds');
  
  checkEndInterval = setTimeout(() => {
    console.log('OTHER video ended (time-based)');
    onVideoEnded();
  }, videoDuration);
}

function onVideoEnded() {
  console.log('Video ended, autoplay enabled:', autoplayEnabled);
  
  if (autoplayEnabled) {
    setTimeout(() => {
      pickRandomVideo();
    }, 100);
  }
}

async function loadVideos() {
  try {
    const response = await fetch('videos.json');
    const data = await response.json();
    videos = data;
    
    loadProgress();
    updateCounter();
    
    if (!firstClick) {
      moveButtonToCorner();
    }
  } catch (error) {
    console.error('Error loading videos:', error);
    progressText.textContent = 'Error';
  }
}

function updateCounter() {
  const total = videos.length;
  const watchedCount = watched.length;
  const percentage = total > 0 ? Math.round((watchedCount / total) * 100) : 0;
  
  progressBar.style.width = percentage + '%';
  progressText.textContent = percentage + '%';
}

function moveButtonToCorner() {
  const container = document.querySelector('.button-container');
  container.style.top = 'auto';
  container.style.left = 'auto';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.transform = 'none';
}

function resetToStart() {
  cleanupPlayer();
  videoFrame.src = '';
  nowPlaying.style.display = 'none';
  
  const container = document.querySelector('.button-container');
  container.style.top = '50%';
  container.style.left = '50%';
  container.style.bottom = 'auto';
  container.style.right = 'auto';
  container.style.transform = 'translate(-50%, -50%)';
  
  firstClick = true;
  watched = [];
  autoplayEnabled = false;
  autoplayBtn.textContent = 'Autoplay: OFF';
  autoplayBtn.style.background = 'rgba(255,255,255,0.3)';
  
  randomBtn.classList.remove('small');
  randomBtn.classList.remove('disabled');
  randomBtn.src = '../img/SpinningWheeBig.webm';
  randomBtn.currentTime = 0;
  randomBtn.pause();
  spinText.classList.remove('hidden');
  
  resumeBtn.style.display = 'none';
  
  fullscreenVideo.classList.remove('playing');
  
  clearProgress();
  updateCounter();
}

function pickRandomVideo() {
  if (watched.length === videos.length) {
    resetToStart();
    return;
  }

  let available = videos.map((v,i)=>i).filter(i=>!watched.includes(i));
  let randomIndex = available[Math.floor(Math.random()*available.length)];
  watched.push(randomIndex);
  currentVideoIndex = randomIndex;

  let video = videos[randomIndex];
  const embedUrl = convertToEmbedUrl(video.Link, video.Platform);

  videoFrame.src = embedUrl;
  
  setTimeout(() => {
    setupVideoEndDetection(video.Platform, embedUrl);
  }, 1000);

  videoTitle.textContent = video.Title;
  videoAuthor.textContent = video.Name;
  authorLink.href = video.Website;

  nowPlaying.style.display = 'block';

  if (firstClick) {
    firstClick = false;
    randomBtn.classList.remove('disabled');
    randomBtn.classList.add('small');
    randomBtn.src = '../img/Spinningwheelsmall.webm';
    spinText.classList.add('hidden');
    fullscreenVideo.classList.add('playing');
    moveButtonToCorner();
  }

  saveProgress(currentVideoIndex);
  updateCounter();
}

function toggleAutoplay() {
  autoplayEnabled = !autoplayEnabled;
  
  if (autoplayEnabled) {
    autoplayBtn.textContent = 'Autoplay: ON';
    autoplayBtn.style.background = 'rgba(30,255,0,0.8)';
  } else {
    autoplayBtn.textContent = 'Autoplay: OFF';
    autoplayBtn.style.background = 'rgba(255,255,255,0.3)';
  }
  
  saveProgress();
}

autoplayBtn.addEventListener('click', toggleAutoplay);
resetBtn.addEventListener('click', resetToStart);

resumeBtn.addEventListener('click', function() {
  const savedCurrentVideo = localStorage.getItem('currentVideo');
  if (savedCurrentVideo) {
    const videoIndex = parseInt(savedCurrentVideo);
    if (videoIndex >= 0 && videoIndex < videos.length) {
      console.log('Resuming saved video:', videoIndex);
      restoreVideo(videoIndex);
    }
  }
});

loadVideos();