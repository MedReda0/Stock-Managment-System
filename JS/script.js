const search_input = document.querySelector("input[type='text']")
const search_clear_btn = document.querySelector(".search .fi-br-cross")

function clear_search(){
    search_clear_btn.classList.add("opacity-0")
    setTimeout(() => {
        search_clear_btn.classList.add("hidden")
    }, 100);
}

search_input.addEventListener("input",()=>{
    search_clear_btn.classList.remove("hidden")
    setTimeout(() => {
        search_clear_btn.classList.remove("opacity-0")
    }, 100);
})

search_input.addEventListener("input",(e)=>{
    if(e.target.value==""){
        clear_search()
    }
})

search_clear_btn.addEventListener("click",()=>{
    if(document.activeElement!==search_input){
        search_input.focus()
    }
    search_input.value=""
    clear_search()
})