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
var screenshot = document.getElementById('screenshot');

var testArray = [{
  usr: '1',
  username: 'Aaron McCarthy',
  title: 'msnruinedus',
  homepage: 'https://aaron-mccarthy.com',
  social: '@aarondamianmccarthy',
}, {
  usr: '2',
  username: 'Adonis Archontides',
  title: 'Za woka genava (I think you are hot)',
  homepage: 'https://ragnanox.com/',
  social: '@ragnanox/'
}, {
  usr: '4',
  username: 'Alfie Dwyer',
  title: 'Circulate',
  homepage: 'http://www.zezima.co.uk',
  social: '@ze.zima'
}, {
  usr: '5',
  username: 'Alif Ibrahim & CJ Park',
  title: 'A Guided Meditation',
  homepage: 'http://www.alifibrahim.com/',
  social: '@ofn.w'
}, {
  usr: '6',
  username: 'Amanda Rice',
  title: 'A death in geological time',
  homepage: 'http://www.amandarice.org/',
  social: '@_amanda_rice'
}, {
  usr: '7',
  username: 'Amy Robson',
  title: 'Hyperloss',
  homepage: 'https://amy-robson.co.uk/',
  social: '@amylrobson_'
}, {
  usr: '10',
  username: 'Charlie Ratcliffe',
  title: 'Come on, Why not?',
  homepage: 'https://www.charlieratcliffe.com/',
  social: '@pottymouthchaz'
}, {
  usr: '11',
  username: 'Chris Collins',
  title: "Today's Modern Office",
  homepage: 'http://chriscollins.online',
  social: '@chris__content'
}, {
  usr: '12',
  username: 'Chris Paul Daniels',
  title: 'YOU ARE A POWER HOUSE',
  homepage: 'http://chrispauldaniels.com',
  social: '@chrispauldaniels'
}];

window.onload = function() {
  for (var i = 0; i < testArray.length; i++) {
    let a = document.createElement("a");
    let p = document.createElement("a");
    let node = document.createTextNode(testArray[i].username);
    let pnode = document.createTextNode("/");
    p.appendChild(pnode);
    a.appendChild(node);
    a.setAttribute("id", testArray[i].usr);
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
    screenshot.src = './img/screenshots/' + testArray[i].usr + '.jpg';
    currentInfo = i;
  } else {
    let i = currentInfo + 1;
    username.innerHTML = testArray[i].username;
    title.innerHTML = testArray[i].title;
    homepage.innerHTML = testArray[i].homepage;
    social.innerHTML = testArray[i].social;
    screenshot.src = './img/screenshots/' + testArray[i].usr + '.jpg';
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
    screenshot.src = './img/screenshots/' + testArray[i].usr + '.jpg';
    currentInfo = i;
  } else {
    let i = currentInfo - 1;
    username.innerHTML = testArray[i].username;
    title.innerHTML = testArray[i].title;
    homepage.innerHTML = testArray[i].homepage;
    social.innerHTML = testArray[i].social;
    screenshot.src = './img/screenshots/' + testArray[i].usr + '.jpg';
    currentInfo = i;
  }
})

var setInfo = function (array, id) {
  for (var i = 0; i < testArray.length; i++) {
    if (testArray[i].usr == id) {
      username.innerHTML = testArray[i].username;
      title.innerHTML = testArray[i].title;
      homepage.innerHTML = testArray[i].homepage;
      social.innerHTML = testArray[i].social;
      screenshot.src = './img/screenshots/' + testArray[i].usr + '.jpg';
      currentInfo = i;
    }
  }
}
