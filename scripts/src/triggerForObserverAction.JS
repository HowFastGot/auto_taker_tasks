export const triggerForObserverAction = (divElement) => {
     divElement.style.transform = "scale(0.3)";

     const idTime = setTimeout(() => {
          divElement.style.transform = "";
          clearTimeout(idTime);
     }, 2000);
}