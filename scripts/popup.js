window.addEventListener("DOMContentLoaded", (e) => {
     const startButton = document.querySelector(".radio-block__start-search");
     const setOrRemoveInterval = document.querySelector(".radio-block__set-interval");


     switch (localStorage.length) {
          case 0:
               chrome.action.setBadgeText({ text: "Started" });
               chrome.action.setBadgeBackgroundColor({ color: "green" });

               startButton.disabled = true;
               break;
          case 1:
               const key = localStorage.key(0);
               chrome.action.setBadgeText({ text: localStorage.getItem(key) ?? "undefined" });
               chrome.action.setBadgeBackgroundColor({ color: "green" });

               startButton.disabled = false;
               break;
          case 2:
               chrome.action.setBadgeText({ text: "2 type" });


               startButton.disabled = false;
               break;
          case 3:
               chrome.action.setBadgeText({ text: "3 type" });
               chrome.action.setBadgeBackgroundColor({ color: "green" });
               break;
          default:
               chrome.action.setBadgeText({ text: "A lot types" });
               chrome.action.setBadgeBackgroundColor({ color: "green" });
     }


     const inputs = document.querySelectorAll("input");

     inputs.forEach((input) => {
          const keyOfValue = `key_${input.getAttribute("name")}`;
          const valueOfAttributes = localStorage.getItem(keyOfValue) ?? "";

          if (valueOfAttributes) {
               input.setAttribute("checked", valueOfAttributes);
          } else {
               input.setAttribute("data-unchecked", true);
          }

          input.addEventListener("change", (e) => {

               if (input.getAttribute("data-unchecked")) {
                    localStorage.setItem(keyOfValue, input.getAttribute("data-taskType"));
                    input.removeAttribute("data-unchecked");

                    startButton.disabled = !e.target.checked;

               } else {
                    localStorage.removeItem(keyOfValue);
                    input.setAttribute("data-unchecked", true);

                    startButton.disabled = localStorage.length === 0;
               }

               switch (localStorage.length) {
                    case 0:
                         chrome.action.setBadgeText({ text: "OFF" });
                         chrome.action.setBadgeBackgroundColor({ color: "#606060" });
                         break;
                    case 1:
                         const key = localStorage.key(0);
                         chrome.action.setBadgeText({ text: localStorage.getItem(key) ?? "undefined" });
                         chrome.action.setBadgeBackgroundColor({ color: "green" });
                         break;
                    case 2:
                         chrome.action.setBadgeText({ text: "2 type" });
                         break;
                    case 3:
                         chrome.action.setBadgeText({ text: "3 type" });
                         break;
                    default:
                         chrome.action.setBadgeText({ text: "Started" });
               }
          });
     });

     document.querySelector(".radio-block__clear-localstorage").addEventListener("click", (e) => {
          localStorage.clear();

          inputs.forEach(input => input.checked = false);
          startButton.disabled = true;

          chrome.action.setBadgeText({ text: "OFF" });
          chrome.action.setBadgeBackgroundColor({ color: "#606060" });

     });

     startButton.addEventListener("click", (e) => {

          const localStorageData = {};

          if (setOrRemoveInterval.classList.contains("active")) {
               localStorageData["interval"] = true;
          } else {
               localStorageData["interval"] = false;
          }

          for (let key in localStorage) {
               if (!localStorage.hasOwnProperty(key)) {
                    continue; // пропустит такие ключи, как "setItem", "getItem" и так далее
               }
               localStorageData[key] = localStorage.getItem(key);
          }

          chrome.runtime.sendMessage({ type: JSON.stringify(localStorageData) });

          chrome.action.setBadgeText({ text: "Searching" });
          chrome.action.setBadgeBackgroundColor({ color: "yellow" });

     });

     setOrRemoveInterval.addEventListener("click", (e) => {

          if (e.target.classList.contains("active")) {
               e.target.classList.remove("active");
          } else {
               e.target.classList.add("active");
          }

     });
});

