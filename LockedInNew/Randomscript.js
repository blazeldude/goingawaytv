let videos = [];
let watched = [];
let firstClick = true;
let autoplayEnabled = false;
let currentPlayer = null;
let currentPlatform = null;
let youtubeAPIReady = false;
let checkEndInterval = null;
let vimeoSetupRetries = 0;
let maxVimeoRetries = 3;
let autoplayVerificationInterval = null;
let isSettingUpPlayer = false;
let currentVideoIndex = null;

// DOM elements
const videoFrame = document.getElementById('videoFrame');
const randomBtn = document.getElementById('randomBtn');
const autoplayBtn = document.getElementById('autoplayBtn');
const videoTitle = document.getElementById('videoTitle');
const videoAuthor = document.getElementById('videoAuthor');
const authorLink = document.getElementById('authorLink');
const nowPlaying = document.getElementById('nowPlaying');
const counter = document.getElementById('counter');
const resetProgressBtn = document.getElementById('resetBtn');

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
  
  if (savedWatched) {
    watched = JSON.parse(savedWatched);
  }
  
  if (savedFirstClick !== null) {
    firstClick = savedFirstClick === 'true';
  }
  
  // Restore the current video if there was one
  if (savedCurrentVideo && videos.length > 0) {
    const videoIndex = parseInt(savedCurrentVideo);
    if (videoIndex >= 0 && videoIndex < videos.length) {
      restoreVideo(videoIndex);
    }
  }
}

// Restore a previously playing video
function restoreVideo(videoIndex) {
  let video = videos[videoIndex];
  const embedUrl = convertToEmbedUrl(video.Link, video.Platform);

  videoFrame.src = embedUrl;
  
  setTimeout(() => {
    setupVideoEndDetection(video.Platform, embedUrl);
  }, 1000);

  videoTitle.textContent = video.Title;
  videoAuthor.textContent = video.Name;
  authorLink.href = video.Website;

  nowPlaying.style.display = 'block';

  if (!firstClick) {
    moveButtonToCorner();
  }
}

// Save progress to localStorage
function saveProgress(currentVideoIndex) {
  localStorage.setItem('watchedVideos', JSON.stringify(watched));
  localStorage.setItem('firstClick', firstClick.toString());
  if (currentVideoIndex !== undefined) {
    localStorage.setItem('currentVideo', currentVideoIndex.toString());
  }
}

// Clear saved progress
function clearProgress() {
  localStorage.removeItem('watchedVideos');
  localStorage.removeItem('firstClick');
  localStorage.removeItem('currentVideo');
}

// Function to convert video link to embeddable URL
function convertToEmbedUrl(link, platform) {
  if (platform.toLowerCase() === 'vimeo') {
    let vimeoId, hash = '';
    
    const matchWithSlash = link.match(/vimeo\.com\/(\d+)\/([a-zA-Z0-9]+)/);
    if (matchWithSlash) {
      vimeoId = matchWithSlash[1];
      hash = matchWithSlash[2];
      return `https://player.vimeo.com/video/${vimeoId}?h=${hash}&autoplay=1&muted=0&byline=0&portrait=0&title=0`;
    }
    
    const matchStandard = link.match(/vimeo\.com\/(\d+)/);
    if (matchStandard) {
      vimeoId = matchStandard[1];
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0&byline=0&portrait=0&title=0`;
    }
  } else if (platform.toLowerCase() === 'youtube') {
    const youtubeId = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)?.[1];
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1&rel=0&origin=${window.location.origin}`;
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
  
  if (autoplayVerificationInterval) {
    clearInterval(autoplayVerificationInterval);
    autoplayVerificationInterval = null;
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
  
  vimeoSetupRetries = 0;
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
  if (!youtubeAPIReady) {
    console.log('YouTube API not ready yet, will retry...');
    setTimeout(setupYouTubePlayer, 500);
    return;
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
  } catch (e) {
    console.log('Error setting up YouTube player:', e);
    isSettingUpPlayer = false;
  }
}

// Fallback for YouTube when API fails
function setupYouTubeFallback() {
  console.log('Using YouTube fallback detection');
  
  // Use a default duration for YouTube videos (typically 3-5 minutes)
  const fallbackDuration = 240000; // 4 minutes default
  
  checkEndInterval = setTimeout(() => {
    console.log('YouTube video ended (time-based fallback)');
    onVideoEnded();
  }, fallbackDuration);
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
  
  // Reset retry counter for new video
  vimeoSetupRetries = 0;
  attemptVimeoSetup();
}

// Attempt to setup Vimeo player with retry logic
function attemptVimeoSetup() {
  if (vimeoSetupRetries >= maxVimeoRetries) {
    console.log('Vimeo setup failed after max retries, falling back to time-based detection');
    setupVimeoFallback();
    isSettingUpPlayer = false;
    return;
  }
  
  // Wait for Vimeo iframe to fully load
  setTimeout(() => {
    try {
      if (typeof Vimeo === 'undefined') {
        console.log('Vimeo API not loaded yet, retrying...');
        vimeoSetupRetries++;
        setTimeout(attemptVimeoSetup, 1000);
        return;
      }
      
      currentPlayer = new Vimeo.Player(videoFrame);
      let playEventCount = 0;
      
      // Setup event listeners
      currentPlayer.on('ended', function() {
        console.log('Vimeo video ended');
        onVideoEnded();
      });
      
      currentPlayer.on('play', function() {
        playEventCount++;
        console.log('Vimeo video started playing (event #' + playEventCount + ')');
        
        // Only verify autoplay for the first play event to avoid duplicates
        if (playEventCount === 1) {
          verifyAutoplay();
        }
      });
      
      currentPlayer.on('pause', function() {
        console.log('Vimeo video paused');
      });
      
      // Verify the player is ready
      currentPlayer.ready().then(function() {
        console.log('Vimeo player setup complete');
        vimeoSetupRetries = 0; // Reset on success
        isSettingUpPlayer = false;
      }).catch(function(error) {
        console.log('Vimeo player not ready:', error);
        vimeoSetupRetries++;
        setTimeout(attemptVimeoSetup, 1000);
      });
      
    } catch (e) {
      console.log('Error setting up Vimeo player:', e);
      vimeoSetupRetries++;
      setTimeout(attemptVimeoSetup, 1000);
    }
  }, 1500); // Reduced delay but with retry logic
}

// Fallback for Vimeo when API fails
function setupVimeoFallback() {
  console.log('Using Vimeo fallback detection');
  
  // Try to get video duration from the iframe URL or use a default
  let fallbackDuration = 180000; // 3 minutes default
  
  // Set up periodic checks for video end
  checkEndInterval = setInterval(() => {
    try {
      if (currentPlayer && currentPlayer.getCurrentTime) {
        currentPlayer.getCurrentTime().then(function(seconds) {
          currentPlayer.getDuration().then(function(duration) {
            if (seconds >= duration - 1) { // Within 1 second of end
              console.log('Vimeo video ended (fallback detection)');
              clearInterval(checkEndInterval);
              onVideoEnded();
            }
          }).catch(() => {
            // If we can't get duration, use time-based fallback
            console.log('Using time-based fallback for Vimeo');
            setTimeout(() => {
              console.log('Vimeo video ended (time-based fallback)');
              onVideoEnded();
            }, fallbackDuration);
          });
        }).catch(() => {
          // If we can't get current time, use time-based fallback
          console.log('Could not get Vimeo current time, using time-based fallback');
        });
      }
    } catch (e) {
      console.log('Fallback detection error:', e);
    }
  }, 2000); // Check every 2 seconds
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

// Verify autoplay is working
function verifyAutoplay() {
  if (!autoplayEnabled) return;
  
  // Clear any existing verification interval
  if (autoplayVerificationInterval) {
    clearInterval(autoplayVerificationInterval);
  }
  
  let verificationCount = 0;
  const maxVerifications = 10;
  
  autoplayVerificationInterval = setInterval(() => {
    verificationCount++;
    
    if (currentPlayer && currentPlayer.getCurrentTime) {
      currentPlayer.getCurrentTime().then(function(seconds) {
        if (seconds > 0) {
          console.log('Autoplay verified - video is playing at', seconds, 'seconds');
          clearInterval(autoplayVerificationInterval);
          autoplayVerificationInterval = null;
        } else if (verificationCount >= maxVerifications) {
          console.log('Autoplay verification failed - video may not be playing');
          clearInterval(autoplayVerificationInterval);
          autoplayVerificationInterval = null;
        }
      }).catch(() => {
        console.log('Could not verify autoplay status');
      });
    }
    
    if (verificationCount >= maxVerifications) {
      clearInterval(autoplayVerificationInterval);
      autoplayVerificationInterval = null;
    }
  }, 1000);
}

// Called when any video ends
function onVideoEnded() {
  console.log('Video ended, autoplay enabled:', autoplayEnabled);
  
  // Clear any verification intervals
  if (autoplayVerificationInterval) {
    clearInterval(autoplayVerificationInterval);
    autoplayVerificationInterval = null;
  }
  
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
    counter.textContent = 'Error loading videos';
  }
}

function updateCounter() {
  counter.textContent = `${watched.length} / ${videos.length}`;
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
    moveButtonToCorner();
    firstClick = false;
  }

  updateCounter();
  saveProgress(randomIndex); // Save the current video index
}

function toggleAutoplay() {
  autoplayEnabled = !autoplayEnabled;
  
  if (autoplayEnabled) {
    autoplayBtn.textContent = 'Autoplay: ON';
    autoplayBtn.style.background = 'rgba(30,255,0,0.8)';
    
    // Start playing if not already started
    if (watched.length === 0) {
      pickRandomVideo();
    }
  } else {
    autoplayBtn.textContent = 'Autoplay: OFF';
    autoplayBtn.style.background = 'rgba(255,255,255,0.3)';
  }
}

// Disable buttons until videos are loaded
randomBtn.disabled = true;
autoplayBtn.disabled = true;

// Load videos on page load
loadVideos();

randomBtn.addEventListener('click', pickRandomVideo);
autoplayBtn.addEventListener('click', toggleAutoplay);
resetProgressBtn.addEventListener('click', function() {
  if (confirm('Are you sure you want to reset your progress? This will clear all watched videos.')) {
    resetToStart();
  }
});