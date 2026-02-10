var enter = document.querySelector('a.enter');
var intro = document.querySelector('div.intro');
var scroller = document.querySelector('div.scroller');
var page = document.querySelector('section.page');
var body = document.querySelector('body');




enter.addEventListener("click", function(){
  intro.style.display = "none";
  body.style.overflowY = "auto";
  document.body.scrollTop = 0; // For Safari
 document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
})
