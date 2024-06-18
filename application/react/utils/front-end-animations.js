export function activeFilter(e) {
    const elems = document.querySelectorAll(".filter-active");
    const clickElement = e.target;  // get the dom element clicked.
    const elementClassName = clickElement.classList.contains("filter-active");  // get the classname of the element clicked
    if(elementClassName){
        e.target.classList.remove('filter-active')
    } else {
        e.target.classList.add('filter-active')
    }
}


