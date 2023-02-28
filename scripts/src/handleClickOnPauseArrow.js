export async function handleClickOnPauseArrow(time = 1000) {
     const arrowElem = document.querySelector(".btn-action-select")?.closest("div");

     if (document.querySelector(".pause-banner")) {
          return false;
     }

     if (arrowElem) {

          arrowElem.click();

          const responseWaiting = new Promise((resolve, reject) => {

               const id = setTimeout(() => {
                    const pauseBtn = document.querySelector(".pause-btn");

                    if (pauseBtn) {

                         pauseBtn.click();

                         const id = setTimeout(() => {
                              resolve(true);
                              clearTimeout(id)
                         }, 500);
                    }

                    const resumeBtn = document.querySelector(".resume-btn");

                    if (resumeBtn) {
                         resolve(false);
                    } else {
                         deleteModals();

                         const id = setTimeout(() => {
                              startManualOrAutoTake({ isObserve: false }, defaultArrayOfTasksType);
                              clearTimeout(id)
                         }, 2000);
                    }
                    clearTimeout(id)
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
