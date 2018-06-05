var MOUSE_VISITED_CLASSNAME = "crx_mouse_visited";
var SHOW_INFO = "show-info";

var links = document.getElementsByTagName("a");

var utminfos = document.createElement("div");
utminfos.className = "utminfo";

var loupe = chrome.extension.getURL("/images/loupe.svg");

var title = document.createElement("h1");
title.innerHTML =
  '<img src="' +
  loupe +
  '" class="svg"/><span class="big">Utm</span><br />Explorer';

var container = document.createElement("div");
container.className = "container";

utminfos.append(title, container);

document.getElementsByTagName("body")[0].appendChild(utminfos);

chrome.runtime.sendMessage("active");

var disabled = true;

chrome.runtime.onMessage.addListener(function(request) {
  if (request == "disabled") {
    disabled = true;
  } else if (request == "enabled") {
    disabled = false;
  }
  return true;
});

for (var i = 0; i < links.length; i++) {
  let link = links[i];
  link.addEventListener("mouseover", function() {
    if (!disabled) {
      showUtm(this.href);
      utminfos.classList.add(SHOW_INFO);
      this.classList.add(MOUSE_VISITED_CLASSNAME);
    }
  });
  link.addEventListener("mouseout", function() {
    utminfos.classList.remove(SHOW_INFO);
    this.classList.remove(MOUSE_VISITED_CLASSNAME);
    container.innerHtml = "";
  });
}

function showUtm(url) {
  var utm = extractUtm(url);
  if (utm) {
    constructPop(utm);
  } else {
    constructPop({ Aucun: "tag UTM" });
  }
}

function extractUtm(url) {
  var regexp = /(?!&)utm_[^=]*=[^&]*/g;
  var matches = url.match(regexp);
  if (matches) {
    var values = matches.reduce(function(obj, param) {
      var keyVal = param.split("=");
      obj[keyVal[0]] = keyVal[1];
      return obj;
    }, {});
  }
  return values;
}

function constructPop(utms) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  Object.keys(utms).map(function(objectKey, index) {
    let value = utms[objectKey];

    let line = document.createElement("div");
    line.className = "line";

    let leftutm = document.createElement("span");
    leftutm.className = "utm";

    let rightutm = document.createElement("span");
    rightutm.className = "value";

    leftutm.append(objectKey);
    rightutm.append(value);
    line.append(leftutm, rightutm);

    container.appendChild(line);
  });
}
