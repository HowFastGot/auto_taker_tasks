chrome.runtime.onMessage.addListener(
     function (request, sender, sendResponse) {

          const taksTypeObj = JSON.parse(request.message);
          const typeOfTaksData = [];

          for (let key in taksTypeObj) {
               typeOfTaksData.push(taksTypeObj[key]);
          }

          takeTask({
               rowTaskSelector: "div.datatable-row-center.datatable-row-group.ng-star-inserted",
               typeTaskSelector: "datatable-body-cell > .datatable-body-cell-label > .ng-tns-c5-1 > .ng-tns-c5-1 > span.ng-tns-c5-1",
               actionButtonSelector: ".actions-button-width",
               takeTaskPlusSelector: ".dropdown-menu .fa-plus",
               modalTextAreaSelector: ".modal .modal-dialog .modal-content textarea",
               yesModalButtonSelector: ".modal-footer button",
               typeTaskTempalte: typeOfTaksData
          });

     }
);

function takeTask({
     rowTaskSelector,
     typeTaskSelector,
     actionButtonSelector,
     takeTaskPlusSelector,
     modalTextAreaSelector,
     yesModalButtonSelector,
     typeTaskTempalte
}) {
     const rowsTasks = document.querySelectorAll(rowTaskSelector);

     const taskWithCorrectType = [...rowsTasks].filter(item => {

          const typeOfTask = item.querySelector(typeTaskSelector).textContent.toLowerCase().trim();

          if (typeTaskTempalte.includes(typeOfTask)) {
               return item;
          }

     });


     if (taskWithCorrectType.length > 0) {
          taskWithCorrectType.forEach((row, i) => {

               if (i >= 4) {
                    alert("Stop on 5th row");
                    return;
               }

               new Promise(function (resolve, reject) {
                    const actionButton = row.querySelector(actionButtonSelector);

                    const handleClickActionBtn = (e) => {

                         actionButton.removeEventListener("click", handleClickActionBtn);

                         setTimeout(() => {
                              const takeTaskButton = row.querySelector(takeTaskPlusSelector);
                              alert(takeTaskButton.tagName);

                              if (takeTaskButton) {
                                   resolve(takeTaskButton);
                              } else {
                                   reject(new Error("Didn't find the take button"));
                              }
                         }, 1500);
                    };

                    if (actionButton) {
                         actionButton.addEventListener("click", handleClickActionBtn);
                         actionButton.dispatchEvent(new MouseEvent("click"));
                    }
               })
                    .then((takeBtn) => {

                         if (takeBtn) {
                              takeBtn.dispatchEvent(new MouseEvent("click"), { bubbles: true });
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
                                        alert("Nothig is taken");
                                   }

                              }, 2500);
                         });
                    })
                    .then(arrow => {

                         arrow.dispatchEvent(new MouseEvent("click"), { bubbles: true });

                         setTimeout(() => {
                              const pauseBtn = document.querySelector(".pause-btn");

                              if (pauseBtn) {
                                   pauseBtn.dispatchEvent(new MouseEvent("click"));
                              } else {
                                   alert("Pause button didn't was found");
                              }

                              const refreshButton = document.querySelector(".row-cols-1 .btn-primary");

                              if (refreshButton) {
                                   refreshButton.dispatchEvent(new MouseEvent("click"));
                              } else {
                                   alert(" Refresh buttom is't found ");
                              }

                         }, 2500);
                    })
                    .catch(err => alert(err));
          });
     } else {
          alert("Nothing of types matches");
     }
}
