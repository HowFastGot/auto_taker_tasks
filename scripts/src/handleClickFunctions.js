export const handleClickOnButton = (e) => {
     e.stopPropagation();
     const clickedButton = e.currentTarget;

     clickedButton.removeEventListener("click", handleClickOnButton);
}
export const bindListenerToButton = (button) => {

     if (button) {
          button.addEventListener("click", handleClickOnButton)
          button.removeAttribute("disabled");
          button.click();
     } else {
          alert("Function - bindListenerToButton. The button wasn't found!")
     }
}
