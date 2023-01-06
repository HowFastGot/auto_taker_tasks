window.addEventListener("DOMContentLoaded", () => {
     const observer = new MutationObserver(() => {
          startAutoTake({ isObserve: true }, null);
     });

     observer.observe(document.querySelector(".datatable-body"), { childList: true, subtree: true });
})

chrome.runtime.onMessage.addListener(
     function (request, sender, sendResponse) {

          const taksTypeObj = JSON.parse(request.message);
          const typeOfTaksData = [];

          for (let key in taksTypeObj) {
               typeOfTaksData.push(taksTypeObj[key]);
          }

          // takeTask({
          //      rowTaskSelector: "div.datatable-row-center.datatable-row-group.ng-star-inserted",
          //      typeTaskSelector: "datatable-body-cell > .datatable-body-cell-label > .ng-tns-c5-1 > .ng-tns-c5-1 > span.ng-tns-c5-1",
          //      actionButtonSelector: ".actions-button-width",
          //      takeTaskPlusSelector: ".dropdown-menu .fa-plus",
          //      modalTextAreaSelector: ".modal .modal-dialog .modal-content textarea",
          //      yesModalButtonSelector: ".modal-footer button",
          //      typeTaskTempalte: typeOfTaksData,
          //      transferReasonSelector: "datatable-body-cell > .datatable-body-cell-label > .text-break > span.text-wrap"
          // });

          startManualOrAutoTake({ isObserve: false }, typeOfTaksData);
     }
);

function takeTask({
     rowTaskSelector,
     typeTaskSelector,
     actionButtonSelector,
     takeTaskPlusSelector,
     modalTextAreaSelector,
     yesModalButtonSelector,
     typeTaskTempalte,
     transferReasonSelector
}) {
     const rowsTasks = document.querySelectorAll(rowTaskSelector);

     if (rowsTasks.length > 0) {
          rowsTasks.forEach((row, i) => {

               const typeOfTask = row.querySelector(typeTaskSelector).textContent.toLowerCase().trim();
               const transferReason = row.querySelector(transferReasonSelector).textContent.toLocaleLowerCase();
               const actionButton = row.querySelector(actionButtonSelector);

               if (!typeTaskTempalte.includes(typeOfTask) || i > 0) {
                    return;
               } else if (typeOfTask === "log editing" && transferReason !== "please check if you can...") {
                    row.closest(".datatable-row-wrapper").remove();
                    return;
               }

               new Promise(function (resolve, reject) {

                    if (actionButton) {
                         resolve(actionButton);
                    } else {
                         reject("Didn't find actionButton");
                    }
               })
                    .then(actionButton => {
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

                         arrow.click();

                         new Promise((resolve, reject) => {

                              setTimeout(() => {
                                   const pauseBtn = document.querySelector(".pause-btn");

                                   if (pauseBtn) {

                                        pauseBtn.click();

                                        resolve(pauseBtn);
                                   } else {
                                        reject("Pause button didn't was found");
                                   }
                              }, 1000);

                         });
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

function startManualOrAutoTake({ isObserve }, typeOfTaksDataArray = ["log editing", "time is running out", "firmware update"]) {
     const taskRows = document.querySelectorAll("div.datatable-row-center.datatable-row-group.ng-star-inserted");

     let divSign;
     let color = taskRows.length > 0 ? "green" : "yellow";
     let countOfRow = 0;

     if (taskRows.lenght !== countOfRow || countOfRow === 0) {

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

          countOfRow = taskRows.length;
          document.body.append(divSign);
     }

     if (taskRows.length > 0) {

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

          if (isObserve) {
               alert("isObserve start");
               divSign.style.transform = "scale(0.3)";

               const idTime = setTimeout(() => {
                    divSign.style.transform = "";
                    clearTimeout(idTime);
               }, 2000);
          }

     }
}







