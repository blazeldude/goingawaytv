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

// DOM elements
const videoFrame = document.getElementById('videoFrame');
const randomBtn = document.getElementById('randomBtn');
const autoplayBtn = document.getElementById('autoplayBtn');
const resetBtn = document.getElementById('resetBtn');
const videoTitle = document.getElementById('videoTitle');
const videoAuthor = document.getElementById('videoAuthor');
const authorLink = document.getElementById('authorLink');
const nowPlaying = document.getElementById('nowPlaying');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

// YouTube API callback
window.onYouTubeIframeAPIReady = function() {
  youtubeAPIReady = true;
  console.log('YouTube API Ready');
};

// Load saved progress from localStorage
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
    // Update UI to match saved state
    if (autoplayEnabled) {
      autoplayBtn.textContent = 'Autoplay: ON';
      autoplayBtn.style.background = 'rgba(30,255,0,0.8)';
    } else {
      autoplayBtn.textContent = 'Autoplay: OFF';
      autoplayBtn.style.background = 'rgba(255,255,255,0.3)';
    }
  }
  
  // Check if we have a saved video to resume
  const savedCurrentVideoIndex = localStorage.getItem('currentVideo');
  if (savedCurrentVideoIndex) {
    const videoIndex = parseInt(savedCurrentVideoIndex);
    if (videoIndex >= 0 && videoIndex < videos.length) {
      // Change RANDOM button to RESUME
      randomBtn.textContent = 'Resume?';
      console.log('Resume available for video index:', videoIndex);
      
      // Move buttons to center when RESUME is available
      const container = document.querySelector('.button-container');
      container.style.top = '50%';
      container.style.left = '50%';
      container.style.bottom = 'auto';
      container.style.right = 'auto';
      container.style.transform = 'translate(-50%, -50%)';
      
      // Reset firstClick so buttons will move to corner when video plays
      firstClick = true;
    }
  }
  
  console.log('Progress loaded. Fresh start on page refresh');
}

// Restore a previously playing video
function restoreVideo(videoIndex) {
  let video = videos[videoIndex];
  const embedUrl = convertToEmbedUrl(video.Link, video.Platform);

  console.log('=== RESTORE VIDEO DEBUG ===');
  console.log('Video index:', videoIndex);
  console.log('Video platform:', video.Platform);
  console.log('Embed URL:', embedUrl);
  console.log('Autoplay enabled:', autoplayEnabled);
  console.log('First click:', firstClick);

  videoFrame.src = embedUrl;
  
  setTimeout(() => {
    setupVideoEndDetection(video.Platform, embedUrl);
  }, 1000);

  videoTitle.textContent = video.Title;
  videoAuthor.textContent = video.Name;
  authorLink.href = video.Website;

  nowPlaying.style.display = 'block';

  // Always move buttons to corner when video is playing
  moveButtonToCorner();
}

// Save progress to localStorage
function saveProgress(currentVideoIndex) {
  localStorage.setItem('watchedVideos', JSON.stringify(watched));
  localStorage.setItem('firstClick', firstClick.toString());
  localStorage.setItem('autoplayEnabled', autoplayEnabled.toString());
  if (currentVideoIndex !== undefined) {
    localStorage.setItem('currentVideo', currentVideoIndex.toString());
  }
}

// Clear saved progress
function clearProgress() {
  localStorage.removeItem('watchedVideos');
  localStorage.removeItem('firstClick');
  localStorage.removeItem('currentVideo');
  localStorage.removeItem('autoplayEnabled');
}

// Function to convert video link to embeddable URL
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

// Clean up previous player
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

// Setup video end detection based on platform
function setupVideoEndDetection(platform, embedUrl) {
  // Prevent multiple simultaneous setups
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
  
  // Reset setup flag after a reasonable delay
  setTimeout(() => {
    isSettingUpPlayer = false;
  }, 3000);
}

// Setup YouTube player with end detection
function setupYouTubePlayer() {
  // Initialize retry counter if not exists
  if (!window.youtubeRetryCount) {
    window.youtubeRetryCount = 0;
  }
  
  if (!youtubeAPIReady) {
    console.log('YouTube API not ready yet, will retry...');
    window.youtubeRetryCount++;
    
    // Stop retrying after 10 attempts
    if (window.youtubeRetryCount >= 10) {
      console.log('YouTube API retry limit reached, giving up');
      isSettingUpPlayer = false;
      return;
    }
    
    window.youtubeRetryTimeout = setTimeout(setupYouTubePlayer, 500);
    return;
  }
  
  // Clear any existing retry timeouts to prevent cascading retries
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
    window.youtubeRetryCount = 0; // Reset counter on success
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
  // YT.PlayerState.ENDED = 0
  if (event.data === 0) {
    console.log('YouTube video ended');
    onVideoEnded();
  }
  isSettingUpPlayer = false;
}

// Setup Vimeo player with end detection
function setupVimeoPlayer() {
  // Double-check that we actually have a Vimeo video
  if (currentPlatform !== 'vimeo') {
    console.log('WARNING: setupVimeoPlayer called but platform is:', currentPlatform, '- aborting');
    isSettingUpPlayer = false;
    return;
  }
  
  // Wait for Vimeo iframe to fully load
  setTimeout(() => {
    try {
      if (typeof Vimeo === 'undefined') {
        console.log('Vimeo API not loaded yet, retrying...');
        setTimeout(setupVimeoPlayer, 1000);
        return;
      }
      
      currentPlayer = new Vimeo.Player(videoFrame);
      
      // Setup event listeners
      currentPlayer.on('ended', function() {
        console.log('Vimeo video ended');
        onVideoEnded();
      });
      
      currentPlayer.on('play', function() {
        console.log('Vimeo video started playing');
      });
      
      currentPlayer.on('pause', function() {
        console.log('Vimeo video paused');
        // When controls are disabled, pause likely means video ended or interaction blocked
        if (videoFrame.src.includes('controls=0')) {
          console.log('Controls disabled - treating pause as video end');
          onVideoEnded();
        }
      });
      
      // Verify the player is ready
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

// Setup detection for OTHER platform (time-based)
function setupOtherPlayer() {
  // The loom.cafe video "Ozwomp's Voyage in Cyberspace" is 6 minutes 13 seconds
  const videoDuration = (6 * 60 + 13) * 1000; // Convert to milliseconds: 373000ms
  
  console.log('Setting up OTHER player with duration:', videoDuration / 1000, 'seconds');
  
  // Set a timeout to trigger video end after the exact duration
  checkEndInterval = setTimeout(() => {
    console.log('OTHER video ended (time-based)');
    onVideoEnded();
  }, videoDuration);
}

// Called when any video ends
function onVideoEnded() {
  console.log('Video ended, autoplay enabled:', autoplayEnabled);
  
  if (autoplayEnabled) {
    // Small delay to ensure proper cleanup
    setTimeout(() => {
      pickRandomVideo();
    }, 100);
  }
}

// Load videos from JSON
async function loadVideos() {
  try {
    const response = await fetch('videos.json');
    const data = await response.json();
    videos = data;
    
    loadProgress();
    updateCounter();
    randomBtn.disabled = false;
    autoplayBtn.disabled = false;
    
    if (!firstClick) {
      moveButtonToCorner();
    }
  } catch (error) {
    console.error('Error loading videos:', error);
    progressText.textContent = 'Error';
  }
}

// Update progress bar
function updateCounter() {
  const total = videos.length;
  const watchedCount = watched.length;
  const percentage = total > 0 ? Math.round((watchedCount / total) * 100) : 0;
  
  // Update progress bar width
  progressBar.style.width = percentage + '%';
  
  // Update progress text
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
  randomBtn.textContent = 'Random'; // Reset button text
  
  clearProgress();
  updateCounter();
}

function pickRandomVideo() {
  // Check if button says RESUME (meaning we have a saved video)
  if (randomBtn.textContent === 'Resume?') {
    const savedCurrentVideo = localStorage.getItem('currentVideo');
    if (savedCurrentVideo) {
      const videoIndex = parseInt(savedCurrentVideo);
      if (videoIndex >= 0 && videoIndex < videos.length) {
        console.log('Resuming saved video:', videoIndex);
        restoreVideo(videoIndex);
        // Change button back to RANDOM after resuming
        randomBtn.textContent = 'Random';
        return;
      }
    }
  }

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

  // Set iframe src
  videoFrame.src = embedUrl;
  
  // Setup end detection after a short delay to allow iframe to load
  setTimeout(() => {
    setupVideoEndDetection(video.Platform, embedUrl);
  }, 1000);

  videoTitle.textContent = video.Title;
  videoAuthor.textContent = video.Name;
  authorLink.href = video.Website;

  nowPlaying.style.display = 'block';

  if (firstClick) {
    firstClick = false;
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

// Event listeners
randomBtn.addEventListener('click', pickRandomVideo);
autoplayBtn.addEventListener('click', toggleAutoplay);
resetBtn.addEventListener('click', resetToStart);

// Initialize
loadVideos();
