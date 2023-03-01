export const deleteUnappropriateTasks = async (typeTaskTempalteArray, row) => {

     const collectionSections = row.querySelectorAll(".datatable-body-cell");
     const isMyTasksBoolean = document.querySelector("#checkBoxes > .row > .col #showMyTasks input").checked;

     const { transferReason, typeOfTask } = {
          transferReason: collectionSections[13].textContent.toLowerCase().trim(),
          typeOfTask: collectionSections[9].querySelector("span").textContent.toLowerCase().trim(),
          taskSubType: collectionSections[9].querySelector("div.datatable-body-cell-label > div > div:nth-child(9) > span")?.textContent ?? ""
     };

     if (!typeTaskTempalteArray.includes(typeOfTask) && !isMyTasksBoolean) {

          return new Promise((resolve, reject) => {
               row.closest(".datatable-row-wrapper").innerHTML =
                    `<div style='width: 1885px; margin: 0 auto; color: #000; text-align: center; border: 1px solid #343a40; line-height: 65px;'>
                    The type of these tasks inappropriate for your preference! Refresh the page!
               </div>`;
               setTimeout(() => {
                    resolve(true)
               }, 500);
          })


     } else if (typeOfTask.toLowerCase() === "log editing" && transferReason !== 'please check if you can...more' && !isMyTasksBoolean) {

          return new Promise((resolve, reject) => {
               row.closest(".datatable-row-wrapper").innerHTML =
                    `<div style='width: 1885px; margin: 0 auto; color: #000; text-align: center; border: 1px solid #343a40; line-height: 65px;'>
                    These tasks were not from the system, someone transfered it! Refresh the page!
               </div >`;
               setTimeout(() => {
                    resolve(true)
               }, 500);
          })

     }
}

