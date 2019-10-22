var popup = document.querySelector(".pop-up");
var closebtn = popup.querySelector(".close");
var next = popup.querySelector(".next");

var names = document.querySelector("div.names");

var username = document.getElementById('username');
var title = document.getElementById('title');
var homepage = document.getElementById('homepage');
var social = document.getElementById('social');

var testArray = [{username:'elliotsven', title:'title', homepage:'homepage', social:'social'}, {username:'nika', title:'nooka', homepage:'nurka', social:'namka'}];

window.onload = function(){
  for (var i = 0; i < testArray.length; i++) {
    let a = document.createElement("a");
    let node = document.createTextNode(testArray[i].username);
    a.appendChild(node);
    a.setAttribute("id", testArray[i].username);
    a.setAttribute("class", "personName");
    names.appendChild(a);
  }
}

closebtn.addEventListener("click", function(){
  popup.style.display = "none";
})

next.addEventListener("click", function(){
  username.innerHTML = testArray[0];
})
