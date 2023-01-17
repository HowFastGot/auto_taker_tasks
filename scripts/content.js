chrome.runtime.onMessage.addListener(
     function (request, sender, sendResponse) {

          const taksTypeObj = JSON.parse(request.message);
          const typeOfTaksData = [];

          for (let key in taksTypeObj) {
               typeOfTaksData.push(taksTypeObj[key]);
          }


          startManualOrAutoTake({ isObserve: false, removedChild: false }, typeOfTaksData);
     }
);

async function handleClickOnPauseArrow(arrowElem) {

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

     // 
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
                    height: 50px;
                    position: fixed;
                    right: 30px;
                    bottom: 200px;
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
          }

     }

     return divSign;
}

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

     if (rowsTasks.length > 0) {

          rowsTasks.forEach((row, i) => {

               const typeOfTask = row.querySelector(typeTaskSelector).textContent.toLowerCase().trim();
               const transferReason = row.querySelector(transferReasonSelector).textContent.toLocaleLowerCase();
               const actionButton = row.querySelector(actionButtonSelector);
               const isProccesedTaskArrowElem = document.querySelector(".btn-action-select").closest("div");

               const isMyTasksBoolean = document.querySelector("#checkBoxes > .row > .col #showMyTasks input").checked;
               let availableIndex = 0;

               if (!typeTaskTempalte.includes(typeOfTask) && !isMyTasksBoolean) {
                    row.closest(".datatable-row-wrapper").innerHTML =
                         "<div style='width: 1885px; margin: 0 auto; color: #000; text-align: center; border: 1px solid #343a40; line-height: 65px;'>Refresh the page afte taking the correct task!</div>";
                    availableIndex = i;
                    return;
               } else if (typeOfTask === "log editing" && transferReason !== "please check if you can..." && !isMyTasksBoolean) {
                    row.closest(".datatable-row-wrapper").innerHTML =
                         "<div style='width: 1885px; margin: 0 auto; color: #000; text-align: center; border: 1px solid #343a40; line-height: 65px;'>Refresh the page afte taking the correct task!</div>";
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
                         actionButton.click();

                         if (isObserve) {
                              actionButton.disabled = true;
                         }

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

                                        if (yesModalButton.tagName.toLowerCase() === "button") {
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
                         handleClickOnPauseArrow(arrow);

                         return true;
                    })
                    .then(() => {
                         new Promise((resolve, reject) => {
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
                    .catch(err => console.log(err));
          });
     }
}

const defaultArrayOfTasksType = ["log editing", "time is running out", "firmware update"];

function startManualOrAutoTake({ isObserve, removedChild }, typeOfTaksDataArray = defaultArrayOfTasksType) {
     const taskRows = document.querySelectorAll("div.datatable-row-center.datatable-row-group.ng-star-inserted");
     const isMyTasksBoolean = document.querySelector("#checkBoxes > .row > .col #showMyTasks input").checked;
     const isAllTransferedTasks = document.querySelector("#transferredTask > input").checked;

     const divElement = createEmtyTaskListIndicator(taskRows.length, isMyTasksBoolean);

     if (isMyTasksBoolean || isAllTransferedTasks) return;

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

               // observerSample.disconnect();
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

          const observer = new MutationObserver((records) => {
               records.forEach(record => {

                    if (record.target !== document.querySelector(".datatable-scroll")) return;

                    if (record.type === "childList" && record.addedNodes.length > 0) {

                         startManualOrAutoTake({ isObserve: true, removedChild: false }, defaultArrayOfTasksType);
                         record.addedNodes?.splice(0);

                    } else if (record.addedNodes.length === 0) {

                         setTimeout(() => {
                              startManualOrAutoTake({ isObserve: true, removedChild: true }, defaultArrayOfTasksType);
                         }, 6000);
                    }
               });
               // 
          });

          observer.observe(document.querySelector(".datatable-body"), { childList: true, subtree: true });

     }
}







