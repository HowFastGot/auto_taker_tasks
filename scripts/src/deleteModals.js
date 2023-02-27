export function deleteModals() {
     const modals = document.querySelectorAll(".modal");

     if (modals?.length > 1) {
          modals.forEach((modal) => {
               modal.remove();
          });
     }
}