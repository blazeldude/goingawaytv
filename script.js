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
  title: 'msnruinedus, hearmeout, Residual Frames, You Belong in Content, Ardrossan',
  homepage: 'http://aaron-mccarthy.com',
  social: '@aarondamianmccarthy',
}, {
  usr: '2',
  username: 'Adonis Archontides',
  title: 'Za woka genava (I think you are hot), Ya gotta wob\'ere! Ya gotta wob\'ere! (Don\'t give up! Keep trying!), Sulsul! Plerg Majah Bliff? (Hello! Can I do something else please?)',
  homepage: 'http://ragnanox.com/',
  social: '@ragnanox/'
}, {
  usr: '4',
  username: 'Alfie Dwyer',
  title: 'Circulate, Curtains',
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
  homepage: 'http://amy-robson.co.uk/',
  social: '@amylrobson_'
}, {
  usr: '9',
  username: 'Bertram von Undall',
  title: 'P',
  homepage: '',
  social: '@bertramvonundall'
}, {
  usr: '10',
  username: 'Charlie Ratcliffe',
  title: 'Come on, Why not?',
  homepage: 'http://charlieratcliffe.com/',
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
}, {
  usr: '13',
  username: 'Christopher MacInnes',
  title: 'Sticky Vectors',
  homepage: 'http://christophermacinnes.com/',
  social: '@ch.ris.to.ph.er'
}, {
  usr: '14',
  username: 'collectif_fact, Annelore Schneider & Claude Piguet',
  title: 'No Wall is Ever Silent',
  homepage: 'http://www.collectif-fact.ch',
  social: '@collectif_fact'
}, {
  usr: '15',
  username: 'Corie McGowan',
  title: 'Silicare™ (2019)',
  homepage: 'http://www.coriemcgowan.com/',
  social: '@cor_mcgowan'
}, {
  usr: '16',
  username: 'Cyrus Hung',
  title: 'Antony Gormley ‘Breaking Bread’, Sean Scully ‘Uninsideout’ Press Release, Georg Baselitz ‘A Focus on the 1980s’',
  homepage: 'http://cyrushung.com',
  social: '@cydehung'
}, {
  usr: '17',
  username: 'Dave Greber',
  title: 'YOUCANTRIPTHESKINOFFOFASNAKE, YouCantRiptheSkinOffofaSnake 2 _ The Return',
  homepage: 'https://www.thesculpted.com',
  social: '@davaygrebere'
}, {
  usr: '18',
  username: 'digostudio',
  title: 'Arbitrary Dreams',
  homepage: 'http://www.digostudio.com',
  social: '@digostudio'
}, {
  usr: '19',
  username: 'Duncan Poulton',
  title: 'Jetsam',
  homepage: 'http://duncanpoulton.com/',
  social: '@duncpoulton'
}, {
  usr: '20',
  username: 'Edgar Alan Rodriguez Castillo',
  title: 'Collagism, 2019',
  homepage: 'http://www.hypercontemporaneity.com',
  social: '@edgaralangopro'
}, {
  usr: '21',
  username: 'Edward Martin',
  title: 'XENOMORPHE (HOX:CODE)',
  homepage: 'https://edwardmartinartist.com',
  social: '@edwardmartin_'
}, {
  usr: '22',
  username: 'Everest Pipkin',
  title: 'Screensaver Collection',
  homepage: 'http://everest-pipkin.com',
  social: '@everestpipkin'
}, {
  usr: '23',
  username: 'Fengyi Zhu',
  title: 'Airplane Mode',
  homepage: 'https://fengyizhu.studio',
  social: '@franciscolacarnum'
}, {
  usr: '24',
  username: 'Fergus Carmichael',
  title: 'Matter of Britain __ 4_50 am BST Glastonbury Tor',
  homepage: 'https://ferguscarmichael.co.uk/',
  social: '@ferguscarmichael'
}, {
  usr: '25',
  username: 'Gretchen Andrew',
  title: 'Turner prize winners',
  homepage: 'https://gretchenandrew.com',
  social: '@gretchenandrew'
}, {
  usr: '26',
  username: 'Guy Oliver',
  title: 'And You Thought I Was Bad?',
  homepage: 'http://guyoliver.co.uk/',
  social: '@guyjoliver'
}, {
  usr: '27',
  username: 'Hannah Marine',
  title: 'The Key to Success',
  homepage: 'http://hannahmarine.co.uk/',
  social: '@hannah_marine'
}, {
  usr: '28',
  username: 'Ian Bruner',
  title: 'earth born or the great depression of Argus Panoptes (chapter one)',
  homepage: 'http://instagram.com/ideath_/',
  social: '@ideath_'
}, {
  usr: '29',
  username: 'Ian Bruner & Don Elektro',
  title: 'TESTGELÄNDE',
  homepage: 'http://donelektro.tumblr.com/, http://instagram.com/ideath_/',
  social: '@don.electro @ideath_'
}, {
  usr: '30',
  username: 'Isabella Benshimol & Mati Jhurry ',
  title: 'Exotic Embassy',
  homepage: 'http://isabellabenshimol.com/, http://matijhurry.com/',
  social: '@ibenshimol @matijhurry'
}, {
  usr: '31',
  username: 'Jakob Kudsk Steensen',
  title: 'RE-ANIMATED: Arrival',
  homepage: 'http://www.jakobsteensen.com/',
  social: '@jakob_kudsk_steensen'
}, {
  usr: '32',
  username: 'James McColl',
  title: 'Monolithic Dome Cap Unit',
  homepage: 'https://jamesmccollartist.com/',
  social: '@jamesmccoll999'
}, {
  usr: '33',
  username: 'Jessy Jetpacks',
  title: 'Racist in Greggs, John Hammond dino egg Daddy ',
  homepage: 'http://www.jessyjetpacks.com/',
  social: '@jessyjetpacks'
}, {
  usr: '34',
  username: 'Kara Gut',
  title: 'Defense Formation AU, Resonant Flesh',
  homepage: 'http://karagut.info',
  social: '@baby_peach123456789'
}, {
  usr: '36',
  username: 'Kiah Reading',
  title: 'The Greater Sunrise, Pure Reason and Bass',
  homepage: 'https://kiahreading.com/',
  social: '@kombuchie'
}, {
  usr: '38',
  username: 'Kumbirai Makumbe',
  title: 'Kumbiraimakumbe@gmail.com',
  homepage: 'http://Koombry.co.uk',
  social: '@koombry'
}, {
  usr: '39',
  username: 'Lambert Duchesne',
  title: 'Amour 2015',
  homepage: 'http://lambertduchesne.com',
  social: '@lambertduchesne'
}, {
  usr: '40',
  username: 'Lotte Rose Kjær Skau',
  title: 'me_fire_grid, me_hairdrizzled, me_braveheart, me_tiger dress, me_camu',
  homepage: 'http://lotte-rose.com/',
  social: '@lotteroser'
}, {
  usr: '41',
  username: 'Louis Judkins',
  title: 'Concrete Dildo Ep.5, Feed The Geese',
  homepage: 'https://vimeo.com/louisjudkins',
  social: '@pooey_louis'
}, {
  usr: '42',
  username: 'Louise Ashcroft',
  title: 'Cephalopod (he wished he could squeeze himself into his own nostril and disappear), Unicorns of Westfield',
  homepage: 'https://www.louiseashcroft.org/',
  social: '@louiseashcroft1'
}, {
  usr: '43',
  username: 'Luke Nairn',
  title: 'Solgar Nutri-Nano™ CoQ-10 3.1x 50 Softgels',
  homepage: 'http://lukenairn.co.uk/',
  social: '@lukenairn'
}, {
  usr: '44',
  username: 'Marion Balac',
  title: 'feels',
  homepage: 'http://www.marionbalac.com/',
  social: '@marionbalac'
}, {
  usr: '45',
  username: 'Mati Jhurry',
  title: 'WELCOME',
  homepage: 'http://matijhurry.com/',
  social: '@matijhurry'
}, {
  usr: '46',
  username: 'Maurício Joseb',
  title: 'OUTISBE',
  homepage: 'https://www.mauriciojoseb.com/autoral',
  social: '@maujoseb'
}, {
  usr: '47',
  username: 'Meg Jenkins',
  title: 'Keep It Together',
  homepage: ' ',
  social: '@megjenkins9051'
}, {
  usr: '48',
  username: 'Molly Erin McCarthy',
  title: 'Western Approach To Paradise',
  homepage: 'https://www.mollyerin.co.uk/',
  social: '@molly.erh'
}, {
  usr: '49',
  username: 'Naomi Fitzsimmons',
  title: 'Thirsty (Chapters 1-3)',
  homepage: 'https://www.naomifitzsimmons.com/',
  social: '@naomi_hf_89'
}, {
  usr: '50',
  username: 'Natalia Skobeeva',
  title: 'Biographies of Objects',
  homepage: 'https://skobeeva.org',
  social: ' '
}, {
  usr: '51',
  username: 'Nikki Lam',
  title: 'Anchor: A Prelude, Still… what is left',
  homepage: 'http://nikkilam.info',
  social: '@curiousother'
}, {
  usr: '52',
  username: 'Ollie Dook',
  title: 'Reflections on a Visit v2',
  homepage: 'http://olliedook.com/',
  social: '@olliedook'
}, {
  usr: '53',
  username: 'Petra Szemán',
  title: 'Monomyth: gaiden / Departure and Initiation',
  homepage: 'http://petraszeman.com',
  social: '@petra_szeman'
}, {
  usr: '54',
  username: 'Qigemu (April Lin and Jasmine Lin)',
  title: 'Reality Fragment 160921',
  homepage: 'https://vimeo.com/qigemu',
  social: '@allthatjasss @babe__lin'
}, {
  usr: '55',
  username: 'Rosie Mcginn',
  title: 'Boxing Staredowns (I-V)',
  homepage: 'www.rosiemcginn.co.uk',
  social: '@rosiemcginnart'
}, {
  usr: '56',
  username: 'Ruaidhri Ryan',
  title: 'Accelerating Towards A Red Light',
  homepage: 'https://ruaidhriryan.com',
  social: '@ruaidhri_ryan'
}, {
  usr: '57',
  username: 'Rufus Rock',
  title: 'Survey',
  homepage: ' ',
  social: '@ru.fus_r.oc.k'
}, {
  usr: '58',
  username: 'Samuel Fouracre',
  title: 'D.^^.$.®. (Dance.Music.Sex.Romance), Oh Rose, thou art sick_Stan_Smith_William_Blake_Edition',
  homepage: 'https://samuelfouracre.com',
  social: '@samuelfouracre'
}, {
  usr: '59',
  username: 'Selden Paterson',
  title: 'IOP B+ Introductory Presentation',
  homepage: 'http://www.selden.website',
  social: '@binauralhealingcentre'
}, {
  usr: '60',
  username: 'Shinji Toya',
  title: 'Pixels without Vagueness',
  homepage: 'https://shinjitoya.com/',
  social: '@shinjitoya'
}, {
  usr: '61',
  username: 'Sid Smith',
  title: 'Extension (For Len Blavatnik), That Cat Trip Ride: No Galore (Eulogy for Baby)',
  homepage: 'https://sidsmith.info',
  social: '@sidsmif'
}, {
  usr: '63',
  username: 'Smriti Mehra, Leslie Johnson, Chinar Shah',
  title: 'More Joy, More Love, More Mortgage',
  homepage: 'https://www.smritimehra.com',
  social: '@smirtrimehra'
}, {
  usr: '64',
  username: 'Stelios Ilchouk',
  title: 'it\'s dangerous to go alone. take this!',
  homepage: 'www.steliosilchouk.com',
  social: '@steliosilchouk'
}, {
  usr: '65',
  username: 'Stine Deja',
  title: '4K Zen',
  homepage: 'http://stinedeja.com',
  social: '@stine_deja'
}, {
  usr: '66',
  username: 'Tabitha Beresford-Webb',
  title: 'Charac and Other and a Reflection, Reflection, Cat and Information',
  homepage: 'tabithabw.co.uk',
  social: '@tabsclouds'
}, {
  usr: '67',
  username: 'Tea Strazicic',
  title: 'Martian Long Year System, Dance With the Devil',
  homepage: 'https://teastrazicic.com/',
  social: '@flufflord'
}, {
  usr: '68',
  username: 'Ted Le Swer',
  title: 'Space Mongers',
  homepage: 'www.tedleswer.org',
  social: '@tedleswer'
}, {
  usr: '69',
  username: 'Theo Tagholm',
  title: 'Edifice',
  homepage: 'http://www.theotagholm.com/',
  social: '@mustard_yeah'
}, {
  usr: '71',
  username: 'Tomasz Kobialka',
  title: 'Pearl Diving for Wyrms',
  homepage: 'http://tomkobialka.com/',
  social: '@kobalska'
}, {
  usr: '72',
  username: 'Wilf Speller',
  title: 'Benjamin\'s Orchid',
  homepage: 'www.wilfspeller.co.uk',
  social: '@wilfspeller'
}, {
  usr: '73',
  username: 'Will Kendrick',
  title: 'I\'ve Never Been There But I Know What it Looks Like',
  homepage: 'www.willkendrick.co.uk',
  social: '@willkendrick1'
}, {
  usr: '74',
  username: 'William Cook',
  title: 'All that glitters is not gold',
  homepage: 'http://art.gold.ac.uk/exhibitions2019/bafa/students/william_cook/1.html',
  social: '@williamjamescook96'
}, {
  usr: '75',
  username: 'Yoojin Lee',
  title: 'sleeping (in \'a city that never sleeps\')',
  homepage: 'https://www.nijooy.com/',
  social: '@nijooy'
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
