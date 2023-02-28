async function asyncLoadingFunction(url) {
     const src = chrome.runtime.getURL(url);
     return await import(src);
}

let handleClickOnPauseArrow,
     deleteModals,
     createEmtyTaskListIndicator,
     deleteUnappropriateTasks,
     bindListenerToButton,
     triggerForObserverAction

asyncLoadingFunction("scripts/src/createEmtyTaskListIndicator.js")
     .then((res) => createEmtyTaskListIndicator = res.createEmtyTaskListIndicator)

asyncLoadingFunction("scripts/src/triggerForObserverAction.js")
     .then((res) => triggerForObserverAction = res.triggerForObserverAction)

asyncLoadingFunction("scripts/src/deleteModals.js")
     .then((res) => deleteModals = res.deleteModals)

asyncLoadingFunction("scripts/src/deleteUnappropriateTasks.js")
     .then((res) => deleteUnappropriateTasks = res.deleteUnappropriateTasks)

asyncLoadingFunction("scripts/src/handleClickFunctions.js")
     .then((res) => bindListenerToButton = res.bindListenerToButton)

asyncLoadingFunction("scripts/src/handleClickOnPauseArrow.js")
     .then((res) => handleClickOnPauseArrow = res.handleClickOnPauseArrow)



let defaultArrayOfTasksType = ["log editing", "time is running out", "firmware update"];

chrome.runtime.onMessage.addListener(
     function (request) {

          const taksTypeObj = JSON.parse(request.message);
          const typeOfTaksData = [];

          for (let key in taksTypeObj) {

               if (key === "interval") continue;

               typeOfTaksData.push(taksTypeObj[key]);
          }


          if (taksTypeObj.interval && !sessionStorage.getItem("idInterval")) {

               let intervalId = setInterval(() => {
                    deleteModals();
                    handleClickOnPauseArrow();

                    const ownDivIndicator = document.querySelector(".own-div");
                    if (ownDivIndicator) {
                         ownDivIndicator.style.background = "red";
                    }
                    bindListenerToButton(document.querySelector(".row-cols-1 .btn-primary"))
                    // startManualOrAutoTake({ isObserve: true }, typeOfTaksData);
               }, 30000);

               sessionStorage.setItem("idInterval", intervalId);

          } else if (sessionStorage.getItem("idInterval")) {

               clearInterval(sessionStorage.getItem("idInterval"));
               sessionStorage.clear();
          }

          startManualOrAutoTake({ isObserve: false }, typeOfTaksData);
     }
);

function startManualOrAutoTake({ isObserve, mutationCount = 0 }, typeOfTaksDataArray = defaultArrayOfTasksType) {
     const taskRows = document.querySelectorAll("div.datatable-row-center.datatable-row-group.ng-star-inserted");

     const divElement = createEmtyTaskListIndicator(taskRows.length);

     if (taskRows.length > 0) {

          if (isObserve) {

               triggerForObserverAction(divElement);

               const id = setTimeout(() => {
                    takeTask({
                         rowTaskSelector: "div.datatable-row-center.datatable-row-group.ng-star-inserted",
                         typeTaskSelector: "datatable-body-cell > .datatable-body-cell-label > .ng-tns-c5-1 > .ng-tns-c5-1 > span.ng-tns-c5-1",
                         actionButtonSelector: ".actions-button-width",
                         takeTaskPlusSelector: ".dropdown-menu .fa-plus",
                         modalTextAreaSelector: ".modal .modal-dialog .modal-content textarea",
                         yesModalButtonSelector: ".modal-footer button",
                         typeTaskTempalte: typeOfTaksDataArray,
                         transferReasonSelector: "datatable-body-cell > .datatable-body-cell-label > .text-break > span.text-wrap",
                         taskRows
                    })
                    clearTimeout(id)
               }, 2000);
          } else {

               takeTask({
                    rowTaskSelector: "div.datatable-row-center.datatable-row-group.ng-star-inserted",
                    typeTaskSelector: "datatable-body-cell > .datatable-body-cell-label > .ng-tns-c5-1 > .ng-tns-c5-1 > span.ng-tns-c5-1",
                    actionButtonSelector: ".actions-button-width",
                    takeTaskPlusSelector: ".dropdown-menu .fa-plus",
                    modalTextAreaSelector: ".modal .modal-dialog .modal-content textarea",
                    yesModalButtonSelector: ".modal-footer button",
                    typeTaskTempalte: typeOfTaksDataArray,
                    taskRows,
                    transferReasonSelector: "datatable-body-cell > .datatable-body-cell-label > .text-break > span.text-wrap"
               });
          }

     } else {

          const observer = new MutationObserver((mutations) => {

               if (mutationCount === 0 && mutations[0].type === "childList" && mutations[0].addedNodes.length > 0) {
                    startManualOrAutoTake({ isObserve: true, mutationCount: mutationCount++ }, defaultArrayOfTasksType);
               }
               mutationCount++;
          });

          observer.observe(document.querySelector(".datatable-body"), { childList: true, subtree: true });
     }
}

function takeTask({
     taskRows,
     actionButtonSelector,
     takeTaskPlusSelector,
     modalTextAreaSelector,
     yesModalButtonSelector,
     typeTaskTempalte
}) {

     if (taskRows.length > 0) {

          taskRows.forEach((row, i) => {

               if (i !== 0) return;

               deleteUnappropriateTasks(typeTaskTempalte, row);

               const actionButton = row.querySelector(actionButtonSelector);

               new Promise(async function (resolve, reject) {

                    const isProccesedTask = await handleClickOnPauseArrow();

                    if (isProccesedTask) {
                         const id = setTimeout(() => {

                              if (actionButton) {
                                   resolve(actionButton);
                              } else {
                                   reject("Didn't find actionButton");
                              }

                              clearTimeout(id)
                         }, 1000);
                    } else {
                         if (actionButton) {
                              resolve(actionButton);
                         } else {
                              reject("Didn't find actionButton");
                         }
                    }
               })
                    .then(actionButton => {

                         bindListenerToButton(actionButton)
                         const takeTaskButton = document.querySelector(takeTaskPlusSelector).closest("button");

                         return new Promise((resolve, reject) => {
                              setTimeout(() => {

                                   if (takeTaskButton) {
                                        resolve(takeTaskButton);
                                   } else {
                                        reject(new Error("Didn't find the take button or modal exist!"));
                                   }
                              }, 500);
                         });

                    })
                    .then((takeBtn) => {
                         bindListenerToButton(takeBtn);
                         const modalTextArea = document.querySelector(modalTextAreaSelector);

                         return new Promise((resolve, reject) => {

                              if (modalTextArea) {

                                   const id = setTimeout(() => {
                                        modalTextArea.value = "Taks has been taken";
                                        const yesModalButton = document.querySelector(yesModalButtonSelector);

                                        if (yesModalButton?.tagName?.toLowerCase() === "button") {
                                             resolve(yesModalButton);
                                        } else {
                                             reject("The yes buttom wasn't found");
                                        }
                                        clearTimeout(id)
                                   }, 1500);
                              } else {
                                   reject("Textarea of modal wasn't found");
                              }

                         });
                    })
                    .then((yesModalButton) => {
                         bindListenerToButton(yesModalButton);


                         return new Promise(async (resolve, reject) => {
                              const id = setTimeout(async () => {
                                   deleteModals();
                                   const response = await handleClickOnPauseArrow();

                                   resolve(response);
                                   clearTimeout(id)
                              }, 3000);

                         });
                    })
                    .then(() => {

                         const refreshButton = document.querySelector(".row-cols-1 .btn-primary");
                         bindListenerToButton(refreshButton);

                         return new Promise((resolve) => {
                              const id = setTimeout(() => {
                                   resolve(true);
                                   clearTimeout(id)
                              }, 1500);
                         });
                    })
                    .then(() => {
                         const id = setTimeout(() => {
                              deleteModals();

                              startManualOrAutoTake({ isObserve: false }, defaultArrayOfTasksType);

                              clearTimeout(id)
                         }, 2000);

                         const indicatorOfCount = document.querySelector(".own-div");

                         if (indicatorOfCount) {
                              let countTakenTasks = sessionStorage.getItem("tasks") ? +sessionStorage.getItem("tasks") : 0;

                              sessionStorage.setItem("tasks", countTakenTasks + 1);
                              indicatorOfCount.textContent = countTakenTasks;
                         }
                    })
                    .catch(err => console.log(err));
          });
     }
}







