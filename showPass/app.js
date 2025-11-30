const input = document.querySelector("input")
const button = document.querySelector("button")

button.addEventListener("click", () => {
    if(input.getAttribute("type") === "password"){
        input.setAttribute("type", "text")
        button.innerText = "hide password"
    }else{
        input.setAttribute("type", "password")
        button.innerText = "show password"
    }
})