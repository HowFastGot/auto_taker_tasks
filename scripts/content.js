chrome.runtime.onMessage.addListener(
     function (request, sender, sendResponse) {

          const taksTypeObj = JSON.parse(request.message);
          const typeOfTaksData = [];

          for (let key in taksTypeObj) {

               if (key === "interval") continue;

               typeOfTaksData.push(taksTypeObj[key]);
          }

          if (taksTypeObj.interval && !sessionStorage.getItem("idInterval")) {

               let intervalId = setInterval(() => {
                    const div = document.querySelector(".own-div");
                    const refreshButton2 = document.querySelector(".row-cols-1 .btn-primary");
                    const rowsTasks = document.querySelectorAll("div.datatable-row-center.datatable-row-group.ng-star-inserted");

                    if (!document.querySelector(".pause-banner")) {
                         handleClickOnPauseArrow(document.querySelector(".btn-action-select").closest("div"));
                    }

                    if (div) {
                         div.style.background = "red";
                    }

                    if (rowsTasks.length > 0) return;

                    let event = new MouseEvent("click");
                    refreshButton2?.dispatchEvent(event);

                    startManualOrAutoTake({ isObserve: true }, typeOfTaksData);
               }, 30000);

               sessionStorage.setItem("idInterval", intervalId);

          } else if (sessionStorage.getItem("idInterval")) {

               clearInterval(sessionStorage.getItem("idInterval"));
               sessionStorage.clear();
          }

          startManualOrAutoTake({ isObserve: false }, typeOfTaksData);
     }
);

async function handleClickOnPauseArrow(arrowElem) {

     const modals = document.querySelectorAll(".modal");

     if (modals?.length > 0) {
          modals.forEach(modal => {
               modal.remove();
          });
     }

     if (arrowElem && !document.querySelector(".pause-banner")) {

          arrowElem.click();

          const responseWaiting = new Promise((resolve, reject) => {

               setTimeout(() => {
                    const pauseBtn = document.querySelector(".pause-btn");

                    if (pauseBtn) {

                         pauseBtn.click();

                         resolve(true);
                         return
                    }

                    const resumeBtn = document.querySelector(".resume-btn");

                    if (resumeBtn) {
                         resolve(false);
                    } else {
                         reject("Didn't find the neither pause nor resume buttons");
                    }

               }, 1500);

          });

          const response = await responseWaiting;

          return response;
     } else {

          const responseSync = new Promise((resolve, reject) => {

               if (arrowElem && document.querySelector(".pause-banner")) {
                    resolve(true)
               } else {
                    reject(false)
               }

          });

          const responseSyncAwait = await responseSync;

          return responseSyncAwait;
     }
}

function createEmtyTaskListIndicator(taskRowsQuant, isMyTasksSection) {

     let divSign;
     let color = taskRowsQuant > 0 ? "green" : "yellow";
     let countOfRow = 0;

     if (taskRowsQuant !== countOfRow || countOfRow == 0) {

          document.querySelector(".own-div")?.remove();

          divSign = document.createElement("div");
          divSign.classList.add("own-div");

          divSign.style.cssText = `
                    display: inline-block;
                    width: 50px;
                    min-height: 50px;
                    position: fixed;
                    right: 30px;
                    bottom: 70px;
                    color: #000;
                    text-align: center;
                    line-height: 50px;
                    z-index: 50;
                    cursor: none;
                    background-color: ${color};
                    border-radius: 50%;
                    transition: all 3s ease;
               `;

          countOfRow = taskRowsQuant.length;

          if (isMyTasksSection) {
               divSign.remove();
          } else {
               document.body.append(divSign);
               divSign.textContent = sessionStorage.getItem("tasks") ?? 0;
          }

     }

     return divSign;
}

const defaultArrayOfTasksType = ["log editing(one time help)", "time is running out", "firmware update"];

function takeTask({
     rowTaskSelector,
     typeTaskSelector,
     actionButtonSelector,
     takeTaskPlusSelector,
     modalTextAreaSelector,
     yesModalButtonSelector,
     typeTaskTempalte,
     transferReasonSelector,
     isObserve
}) {

     const rowsTasks = document.querySelectorAll(rowTaskSelector);

     const modal = document.querySelector(".modal.fade.show");

     if (modal) {
          return;
     }

     if (rowsTasks.length > 0) {

          rowsTasks.forEach((row, i) => {
               const collectionSections = row.querySelectorAll(".datatable-body-cell");

               const taskData = {
                    transferReason: collectionSections[13].textContent.trim(),
                    typeOfTask: collectionSections[9].querySelector("span").textContent.toLowerCase().trim(),
                    taskSubType: collectionSections[9].querySelector("div.datatable-body-cell-label > div > div:nth-child(9) > span")?.textContent ?? ""
               };

               const { transferReason, typeOfTask } = taskData;
               const actionButton = row.querySelector(actionButtonSelector);
               const isProccesedTaskArrowElem = document.querySelector(".btn-action-select")?.closest("div");

               const isMyTasksBoolean = document.querySelector("#checkBoxes > .row > .col #showMyTasks input").checked;
               let availableIndex = 0;
               alert(typeOfTask.toLowerCase() + "  typeOfTask " + typeTaskTempalte.includes(typeOfTask))
               if (!typeTaskTempalte.includes(typeOfTask) && !isMyTasksBoolean) {
                    row.closest(".datatable-row-wrapper").innerHTML =
                         `<div style='width: 1885px; margin: 0 auto; color: #000; text-align: center; border: 1px solid #343a40; line-height: 65px;'>
                              The type of these tasks inappropriate for your preference! Refresh the page!
                         </div>`;
                    availableIndex = i;
                    return;
               } else if (typeOfTask.toLowerCase() === "log editing" && transferReason.toLowerCase() !== "please check if you can..." && !isMyTasksBoolean) {
                    row.closest(".datatable-row-wrapper").innerHTML =
                         `<div style='width: 1885px; margin: 0 auto; color: #000; text-align: center; border: 1px solid #343a40; line-height: 65px;'>
                              These tasks were not from the system, someone transfered it! Refresh the page!
                         </div >`;
                    return;

               } else if (i > availableIndex) {
                    return;
               }


               new Promise(function (resolve, reject) {

                    let isProccesedTask = handleClickOnPauseArrow(isProccesedTaskArrowElem);

                    if (isProccesedTask) {
                         setTimeout(() => {

                              if (actionButton) {
                                   resolve(actionButton);
                              } else {
                                   reject("Didn't find actionButton");
                              }
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

                         const handleClickActionButton = (e) => {
                              e.stopPropagation();
                              actionButton.removeEventListener("click", handleClickActionButton);
                         }

                         if (actionButton) {
                              actionButton.addEventListener("click", handleClickActionButton)
                         }

                         actionButton.click();

                         return new Promise((resolve, reject) => {
                              const takeTaskButton = document.querySelector(takeTaskPlusSelector).closest("button"); // проблема с текой тасков тут

                              setTimeout(() => {

                                   if (takeTaskButton) {
                                        resolve(takeTaskButton);
                                   } else {
                                        reject(new Error("Didn't find the take button"));
                                   }
                              }, 500);
                         });

                    })
                    .then((takeBtn) => {
                         if (takeBtn) {
                              takeBtn.click();
                         }

                         return new Promise((resolve, reject) => {
                              const modalTextArea = document.querySelector(modalTextAreaSelector);

                              if (modalTextArea.tagName.toLowerCase() === "textarea") {

                                   setTimeout(() => {
                                        modalTextArea.value = "Taks has been taken";

                                        const yesModalButton = document.querySelector(yesModalButtonSelector);

                                        if (yesModalButton?.tagName?.toLowerCase() === "button") {
                                             resolve(yesModalButton);
                                        } else {
                                             reject("The yes buttom wasn't found");
                                        }
                                   }, 1500);
                              } else {
                                   reject("Textarea of modal wasn't found");
                              }

                         });
                    })
                    .then((yesModalButton) => {

                         if (yesModalButton) {
                              yesModalButton.removeAttribute("disabled");
                              yesModalButton.dispatchEvent(new MouseEvent("click"));
                         } else {
                              alert("YesButtom wasn't resolved in promise");
                         }

                         return new Promise((resolve, reject) => {
                              setTimeout(() => {
                                   const arrowCurrentTask = document.querySelector(".btn-action-select").closest("div");

                                   if (arrowCurrentTask) {
                                        resolve(arrowCurrentTask);
                                   } else {
                                        reject("Nothig is taken");
                                   }

                              }, 2500);
                         });
                    })
                    .then(arrow => {
                         return handleClickOnPauseArrow(arrow);
                    })
                    .then(() => {

                         const indicatorOfCount = document.querySelector(".own-div");

                         if (indicatorOfCount) {
                              let countTakenTasks = sessionStorage.getItem("tasks") ? +sessionStorage.getItem("tasks") : 0;

                              sessionStorage.setItem("tasks", countTakenTasks + 1);
                              indicatorOfCount.textContent = countTakenTasks;
                         }

                         return new Promise((resolve, reject) => {
                              setTimeout(() => {

                                   const refreshButton = document.querySelector(".row-cols-1 .btn-primary");

                                   if (refreshButton) {
                                        refreshButton.click();

                                        resolve(refreshButton);
                                   } else {
                                        reject(" Refresh buttom is't found ");
                                   }

                              }, 1500);
                         });
                    })
                    .then(() => {
                         if (document.querySelectorAll(rowTaskSelector).length > 4 && isObserve) return;

                         setTimeout(() => {
                              startManualOrAutoTake({ isObserve: false }, defaultArrayOfTasksType);
                         }, 3000);
                    })
                    .catch(err => console.log(err));
          });
     }
}

function startManualOrAutoTake({ isObserve }, typeOfTaksDataArray = defaultArrayOfTasksType) {
     const taskRows = document.querySelectorAll("div.datatable-row-center.datatable-row-group.ng-star-inserted");
     const isMyTasksBoolean = document.querySelector("#checkBoxes > .row > .col #showMyTasks input").checked;
     const isAllTransferedTasks = document.querySelector("#transferredTask > input").checked;

     const divElement = createEmtyTaskListIndicator(taskRows.length, isMyTasksBoolean);

     if (taskRows.length > 0) {

          if (isObserve) {

               setTimeout(() => {
                    takeTask({
                         rowTaskSelector: "div.datatable-row-center.datatable-row-group.ng-star-inserted",
                         typeTaskSelector: "datatable-body-cell > .datatable-body-cell-label > .ng-tns-c5-1 > .ng-tns-c5-1 > span.ng-tns-c5-1",
                         actionButtonSelector: ".actions-button-width",
                         takeTaskPlusSelector: ".dropdown-menu .fa-plus",
                         modalTextAreaSelector: ".modal .modal-dialog .modal-content textarea",
                         yesModalButtonSelector: ".modal-footer button",
                         typeTaskTempalte: typeOfTaksDataArray,
                         transferReasonSelector: "datatable-body-cell > .datatable-body-cell-label > .text-break > span.text-wrap",
                         isObserve
                    })
               }, 2000);

               divElement.style.transform = "scale(0.3)";

               const idTime = setTimeout(() => {
                    divElement.style.transform = "";
                    clearTimeout(idTime);
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
                    transferReasonSelector: "datatable-body-cell > .datatable-body-cell-label > .text-break > span.text-wrap"
               });
          }

     } else {

          const observer = new MutationObserver((records, observerParticular) => {

               observerParticular.disconnect();

               records.forEach((record, index) => {

                    if (record.target !== document.querySelector(".datatable-scroll") ||
                         document.querySelector("modal-container") || record.type !== "childList" ||
                         index > 3 || record.removedNodes.length > 0
                    ) {

                         return
                    };

                    for (let i = 0; i < record.addedNodes.length; i++) {

                         switch (index) {

                              case 1:
                                   startManualOrAutoTake({ isObserve: true }, defaultArrayOfTasksType);
                                   break;
                              case 2:
                                   setTimeout(() => {
                                        startManualOrAutoTake({ isObserve: true }, defaultArrayOfTasksType);
                                   }, 7000);
                                   break;
                              case 3:
                                   setTimeout(() => {

                                        startManualOrAutoTake({ isObserve: true }, defaultArrayOfTasksType);
                                   }, 17000);
                                   break;
                              case 0:
                                   setTimeout(() => {
                                        startManualOrAutoTake({ isObserve: true }, defaultArrayOfTasksType);
                                   }, 27000);
                                   break;
                              default:
                                   alert("Default" + index);
                                   return;
                         }
                    }
               });

          });

          observer.observe(document.querySelector(".datatable-body"), { childList: true, subtree: true });

     }
}







