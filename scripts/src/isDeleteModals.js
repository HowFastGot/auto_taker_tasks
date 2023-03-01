export async function isDeleteModals(isObserve) {
     const modals = document.querySelectorAll(".modal");

     if (modals?.length) {

          return new Promise((resolve, reject) => {
               modals.forEach((modal, i) => {

                    if (isObserve && i == 0) return;

                    modal.remove();
               });

               setTimeout(() => {
                    resolve(true);
               }, 1000);
          });

     } else {
          return Promise.resolve(false);
     }
}