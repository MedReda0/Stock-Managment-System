const search_input = document.querySelector("input[type='text']")
const search_clear_btn = document.querySelector(".search .fi-br-cross")
const filter_btn = document.querySelector(".filter-btn")
const filter_pop = document.querySelector(".filter-pop")
const add_product_btn = document.querySelector(".add-product-btn")
const add_product_pop = document.querySelector(".add-product-pop")
const add_done_btn = document.querySelector(".add-btn")
const edit_product_pop = document.querySelector(".edit-product-pop")
const edit_done_btn = document.querySelector(".edit-btn")
const pop_up = document.querySelectorAll(".pop-up")
const pop_close_btn = document.querySelectorAll(".close-btn")
const overlay = document.querySelector(".overlay")
const date = document.querySelector(".date")
let current_tr
const low_stock_card = document.querySelector(".low-stock")
const low_stock_card_txt_white = document.querySelectorAll(".txt-white")
const out_stock_card = document.querySelector(".out-stock .info .num")
const total_prods_card = document.querySelector(".total-prods .info .num")
const total_value_card = document.querySelector(".total-value .info .num")

const tbody = document.querySelector("#inventory tbody");
function clear_search() {
    search_clear_btn.classList.add("opacity-0")
    setTimeout(() => {
        search_clear_btn.classList.add("hidden")
    }, 100);
}

search_input.addEventListener("input", () => {
    search_clear_btn.classList.remove("hidden")
    setTimeout(() => {
        search_clear_btn.classList.remove("opacity-0")
    }, 100);
})

search_input.addEventListener("input", (e) => {
    if (e.target.value == "") {
        clear_search()
    }
})

search_clear_btn.addEventListener("click", () => {
    if (document.activeElement !== search_input) {
        search_input.focus()
    }
    search_input.value = ""
    clear_search()
})

function pop_up_toggle(ele) {
    if (ele.classList.contains("hidden")) {
        ele.classList.remove("hidden")
        overlay.classList.remove("hidden")
        setTimeout(() => {
            ele.classList.remove("opacity-0")
            overlay.classList.remove("opacity-0")
        }, 100);
    } else {
        ele.classList.add("opacity-0")
        overlay.classList.add("opacity-0")
        setTimeout(() => {
            ele.classList.add("hidden")
            overlay.classList.add("hidden")
        }, 100);
    }

}

[add_product_btn, filter_btn].forEach((btn) => {
    btn.addEventListener("click", () => { pop_up_toggle(document.querySelector(`.${btn.dataset.popUp}`)) })
})

pop_close_btn.forEach((btn => {
    btn.addEventListener("click", () => {
        pop_up_toggle(btn.parentElement.parentElement)
    })
}))

overlay.addEventListener("click", () => {
    [...pop_up].map((a_pop) => { a_pop.classList.contains("hidden") == false ? pop_up_toggle(a_pop) : "" })
})

const today_date = new Date();

const form = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
});

date.textContent = form.format(today_date)

const inventory = [
    { id: 1, name: "Wireless Mouse", category: "Electronics", stock: 145, price: 24.99 },
    { id: 2, name: "Mechanical Keyboard", category: "Electronics", stock: 12, price: 129.50 },
    { id: 3, name: "Office Chair", category: "Furniture", stock: 0, price: 199.00 },
    { id: 4, name: "USB-C Cable (2m)", category: "Accessories", stock: 450, price: 14.99 },
    { id: 4, name: "USB-C Cable (2m)", category: "Accessories", stock: 450, price: 14.99 },
    { id: 4, name: "USB-C Cable (2m)", category: "Accessories", stock: 450, price: 14.99 },
    { id: 4, name: "USB-C Cable (2m)", category: "Accessories", stock: 450, price: 14.99 }
];

function getStockStatus(stock) {
    if (stock > 20) {
        return { label: "IN STOCK", class: "in-stock" };
    } else if (stock > 0) {
        return { label: "LOW STOCK", class: "low-stock" };
    } else {
        return { label: "OUT OF STOCK", class: "out-stock" };
    }
}

function renderTable() {
    if (!tbody) return;
    const low_stock = inventory.filter(item => item.stock > 0 && item.stock <= 20).length;
    const out_stock = inventory.filter(item => item.stock === 0).length;
    const total_prods = inventory.reduce((sum, item) => sum + item.stock, 0);
    const total_value = inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
    
    low_stock_card.querySelector(".info .num").textContent = low_stock;
    out_stock_card.textContent = out_stock;
    total_prods_card.textContent = total_prods;
    total_value_card.textContent = `${total_value.toFixed(2)} DH`;
    
    if(low_stock_card.querySelector(".info .num").textContent>0){
        low_stock_card.classList.add("bg-red-500/80!")
        low_stock_card.querySelector("i").classList.add("bg-white/20!")
        low_stock_card_txt_white.forEach((ele)=>{
            ele.classList.add("text-white!")
        })
    }else{
        low_stock_card.classList.remove("bg-red-500/80!")
        low_stock_card.querySelector("i").classList.remove("bg-white/20!")
        low_stock_card_txt_white.forEach((ele) => {
            ele.classList.remove("text-white!")
        })
    }

    tbody.innerHTML = "";
    inventory.forEach(item => {
        const status = getStockStatus(item.stock);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <span class="max-tablet:inline hidden text-text-color/80 mr-1">ID:</span>${item.id}
            </td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>
                <span class="status-badge ${status.class}">${status.label}</span>
                <span class="text-black font-bold text-[13px] ml-2">${item.stock} units</span>
            </td>
            <td>${item.price.toFixed(2)} DH</td>
            <td>
                <div class="desktop-actions">
                    <i class="fi fi-sr-edit edit-product-btn"></i>
                    <i class="fi fi-sr-trash delete-product-btn"></i>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

renderTable();

add_done_btn.addEventListener("click", () => {
    const newId = inventory.length > 0 ? Math.max(...inventory.map(item => item.id)) + 1 : 1;
    
    const newProduct = {
        id: newId,
        name: add_product_pop.querySelector("#name").value,
        category: add_product_pop.querySelector("#category").value,
        stock: parseInt(add_product_pop.querySelector("#stock").value) || 0,
        price: parseFloat(add_product_pop.querySelector("#price").value) || 0,
    };
    inventory.push(newProduct);
    renderTable()
})


tbody.addEventListener("click", (e) => {
    if (e.target.closest(".edit-product-btn")) {
        let tr = e.target.closest("tr")
        let id = parseInt(tr.querySelector("td:nth-child(1)").textContent.replace('ID:', ''))
        
        current_tr = inventory.findIndex(item => item.id === id)
        
        edit_product_pop.querySelector("#name").value = inventory[current_tr].name
        edit_product_pop.querySelector("#category").value = inventory[current_tr].category
        edit_product_pop.querySelector("#stock").value = inventory[current_tr].stock
        edit_product_pop.querySelector("#price").value = inventory[current_tr].price
        pop_up_toggle(edit_product_pop)
    }
    if (e.target.closest(".delete-product-btn")) {
        let tr = e.target.closest("tr")
        let id = parseInt(tr.querySelector("td:nth-child(1)").textContent.replace('ID:', ''))
        
        let index = inventory.findIndex(item => item.id === id)
        if (index > -1) {
            inventory.splice(index, 1)
        }
        renderTable()
    }
})

edit_done_btn.addEventListener("click", () => {
    inventory[current_tr].name = edit_product_pop.querySelector("#name").value
    inventory[current_tr].category = edit_product_pop.querySelector("#category").value
    inventory[current_tr].stock = parseInt(edit_product_pop.querySelector("#stock").value)
    inventory[current_tr].price = parseFloat(edit_product_pop.querySelector("#price").value)
    renderTable()
})