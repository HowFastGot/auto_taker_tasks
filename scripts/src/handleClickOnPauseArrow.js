export async function handleClickOnPauseArrow(time = 1500) {

     if (document.querySelector(".pause-banner")) {
          return false;
     }

     const arrowElem = document.querySelector(".btn-action-select")?.closest("div");

     if (arrowElem) {

          arrowElem.click();

          const responseWaiting = new Promise((resolve, reject) => {

               setTimeout(() => {
                    const pauseBtn = document.querySelector(".pause-btn");

                    if (pauseBtn) {

                         pauseBtn.click();

                         setTimeout(() => {
                              resolve(true);
                         }, 500);
                         return;
                    }

                    const resumeBtn = document.querySelector(".resume-btn");

                    if (resumeBtn) {
                         resolve(false);
                    } else {
                         deleteModals();

                         setInterval(() => {
                              startManualOrAutoTake({ isObserve: false }, defaultArrayOfTasksType);
                         }, 2000);
                    }

               }, time);

          });

          const response = await responseWaiting;

          return response;
     } else {

          const responseSync = new Promise((resolve, reject) => {

               if (arrowElem && document.querySelector(".pause-banner")) {
                    resolve(false)
               } else {
                    reject("Arrow elem or pause banner not was found")
               }

          });

          const responseSyncAwait = await responseSync;

          return responseSyncAwait;
     }
}
