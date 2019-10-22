var popup = document.querySelector(".pop-up");
var closebtn = popup.querySelector(".close");
var next = popup.querySelector(".next");
var prev = popup.querySelector(".prev");
var names = document.querySelector("div.names");

var currentInfo;

var username = document.getElementById('username');
var title = document.getElementById('title');
var homepage = document.getElementById('homepage');
var social = document.getElementById('social');
var testArray = [{
  username: 'elliotsven',
  title: 'title',
  homepage: 'homepage',
  social: 'social'
}, {
  username: 'nika',
  title: 'nooka',
  homepage: 'nurka',
  social: 'namka'
}, {
  username: 'Jeff',
  title: 'Chucks',
  homepage: 'Harry',
  social: 'Egg'
} ];

window.onload = function() {
  for (var i = 0; i < testArray.length; i++) {
    let a = document.createElement("a");
    let p = document.createElement("a");
    let node = document.createTextNode(testArray[i].username);
    let pnode = document.createTextNode("/");
    p.appendChild(pnode);
    a.appendChild(node);
    a.setAttribute("id", testArray[i].username);
    a.setAttribute("class", "personName");
    a.addEventListener('click', function() {
      popup.style.display = "block";
      setInfo(testArray, this.id);
    });
    names.appendChild(a);
    names.appendChild(p);
  }
}

closebtn.addEventListener("click", function() {
  popup.style.display = "none";
})

next.addEventListener("click", function() {
  if (currentInfo + 1 >= testArray.length) {
    let i = 0;
    username.innerHTML = testArray[i].username;
    title.innerHTML = testArray[i].title;
    homepage.innerHTML = testArray[i].homepage;
    social.innerHTML = testArray[i].social;
    currentInfo = i;
  } else {
    let i = currentInfo + 1;
    username.innerHTML = testArray[i].username;
    title.innerHTML = testArray[i].title;
    homepage.innerHTML = testArray[i].homepage;
    social.innerHTML = testArray[i].social;
    currentInfo = i;
  }
})

prev.addEventListener("click", function() {
  if (currentInfo == 0) {
    let i = testArray.length -1;
    username.innerHTML = testArray[i].username;
    title.innerHTML = testArray[i].title;
    homepage.innerHTML = testArray[i].homepage;
    social.innerHTML = testArray[i].social;
    currentInfo = i;
  } else {
    let i = currentInfo - 1;
    username.innerHTML = testArray[i].username;
    title.innerHTML = testArray[i].title;
    homepage.innerHTML = testArray[i].homepage;
    social.innerHTML = testArray[i].social;
    currentInfo = i;
  }
})

var setInfo = function (array, id) {
  for (var i = 0; i < testArray.length; i++) {
    if (testArray[i].username == id) {
      username.innerHTML = testArray[i].username;
      title.innerHTML = testArray[i].title;
      homepage.innerHTML = testArray[i].homepage;
      social.innerHTML = testArray[i].social;
      currentInfo = i;
    }
  }
}
