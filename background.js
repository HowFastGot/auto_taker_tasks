chrome.runtime.onInstalled.addListener(async function () {
     await chrome.action.setBadgeBackgroundColor({
          color: "#606060"
     });

     await chrome.action.setBadgeText({
          text: 'OFF'
     });
});

chrome.runtime.onMessage.addListener(
     async function (request) {
          let queryOptions = { active: true, lastFocusedWindow: true };
          let [tab] = await chrome.tabs.query(queryOptions);
          await chrome.tabs.sendMessage(tab.id, { message: request.type });
     }
);





