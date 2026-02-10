window.addEventListener('load', function() {

var countDownDate = new Date("Jan 17, 2026 10:00:00").getTime();

var x = setInterval(function() {

  var now = new Date().getTime();

  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("timer").innerHTML = 
  days + '<span class ="time-unit">d</span>' + 
  hours + '<span class ="time-unit">h</span>' + 
  minutes + '<span class ="time-unit">m</span>' + 
  seconds + '<span class ="time-unit">s</span>';

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "EXPIRED";
  }
}, 1000);
});