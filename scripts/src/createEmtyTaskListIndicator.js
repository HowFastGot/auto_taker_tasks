export function createEmtyTaskListIndicator(taskRowsQuant) {
     const isMyTasksSection = document.querySelector("#checkBoxes > .row > .col #showMyTasks input").checked;
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
