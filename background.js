"use strict";

var active = false;

chrome.pageAction.onClicked.addListener(function(tab) {
  if (active) {
    chrome.pageAction.setIcon({ tabId: tab.id, path: "images/icon16d.png" });
    chrome.tabs.sendMessage(tab.id, "disabled");
  } else {
    chrome.pageAction.setIcon({ tabId: tab.id, path: "images/icon16.png" });
    chrome.tabs.sendMessage(tab.id, "enabled");
  }
  active = !active;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);
});
