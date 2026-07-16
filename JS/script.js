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
    btn.addEventListener("click", () => { 
        let target = document.querySelector(`.${btn.dataset.popUp}`)
        pop_up_toggle(target)
        if (target == add_product_pop){
            target.querySelectorAll("input").forEach((ele)=>ele.value="")
            target.querySelector("#category").selectedIndex = 0
        }
    })
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

const API_URL = "http://localhost:3000/api/products";

// Filter state
let activeFilters = {
    category: "",
    stockStatus: [],
    priceMin: null,
    priceMax: null,
    alphabetical: false,
    descending: false,
};

// Filter DOM elements
const filterCategory = document.querySelector("#filter-category")
const filterAlphabetical = document.querySelector("#filter-alphabetical")
const filterAscending = document.querySelector("#filter-ascending")
const filterDescending = document.querySelector("#filter-descending")
const filterInStock = document.querySelector("#filter-in-stock")
const filterLowStock = document.querySelector("#filter-low-stock")
const filterOutStock = document.querySelector("#filter-out-stock")
const filterPriceMin = document.querySelector("#filter-price-min")
const filterPriceMax = document.querySelector("#filter-price-max")
const applyFiltersBtn = document.querySelector(".apply-btn")
const clearFiltersBtn = document.querySelector(".clear-btn")

function getStockStatusLabel(stock) {
    if (stock > 20) return "in-stock"
    if (stock > 0) return "low-stock"
    return "out-stock"
}

function getStockStatus(stock) {
    if (stock > 20) {
        return { label: "IN STOCK", class: "in-stock" };
    } else if (stock > 0) {
        return { label: "LOW STOCK", class: "low-stock" };
    } else {
        return { label: "OUT OF STOCK", class: "out-stock" };
    }
}

function applyFiltersToInventory(inventory) {
    let filtered = [...inventory]

    // Category filter
    if (activeFilters.category) {
        filtered = filtered.filter(item => item.category === activeFilters.category)
    }

    // Stock status filter
    if (activeFilters.stockStatus.length > 0) {
        filtered = filtered.filter(item => activeFilters.stockStatus.includes(getStockStatusLabel(item.stock)))
    }

    // Price range filter
    if (activeFilters.priceMin !== null) {
        filtered = filtered.filter(item => parseFloat(item.price) >= activeFilters.priceMin)
    }
    if (activeFilters.priceMax !== null) {
        filtered = filtered.filter(item => parseFloat(item.price) <= activeFilters.priceMax)
    }

    // Alphabetical sort
    if (activeFilters.alphabetical) {
        filtered.sort((a, b) => {
            const cmp = a.name.localeCompare(b.name)
            return activeFilters.descending ? -cmp : cmp
        })
    }

    return filtered
}

function resetFilterUI() {
    filterCategory.value = ""
    filterAlphabetical.checked = false
    filterAscending.checked = true
    filterDescending.checked = false
    filterInStock.checked = false
    filterLowStock.checked = false
    filterOutStock.checked = false
    filterPriceMin.value = ""
    filterPriceMax.value = ""

    activeFilters = {
        category: "",
        stockStatus: [],
        priceMin: null,
        priceMax: null,
        alphabetical: false,
        descending: false,
    }
}

async function renderTable() {
    if (!tbody) return;

    const inventory = await fetch(API_URL).then(res => res.json());

    // Stats use ALL products (unfiltered)
    const low_stock = inventory.filter(item => item.stock > 0 && item.stock <= 20).length;
    const out_stock = inventory.filter(item => item.stock === 0).length;
    const total_prods = inventory.reduce((sum, item) => sum + item.stock, 0);
    const total_value = inventory.reduce((sum, item) => sum + (parseFloat(item.price) * item.stock), 0);

    low_stock_card.querySelector(".info .num").textContent = low_stock;
    out_stock_card.textContent = out_stock;
    total_prods_card.textContent = total_prods;
    total_value_card.textContent = `${total_value.toFixed(2)} DH`;

    if (low_stock_card.querySelector(".info .num").textContent > 0) {
        low_stock_card.classList.add("bg-red-500/80!")
        low_stock_card.querySelector("i").classList.add("bg-white/20!")
        low_stock_card_txt_white.forEach((ele) => {
            ele.classList.add("text-white!")
        })
    } else {
        low_stock_card.classList.remove("bg-red-500/80!")
        low_stock_card.querySelector("i").classList.remove("bg-white/20!")
        low_stock_card_txt_white.forEach((ele) => {
            ele.classList.remove("text-white!")
        })
    }

    // Apply filters to table display
    const displayItems = applyFiltersToInventory(inventory)

    tbody.innerHTML = "";
    displayItems.forEach(item => {
        const status = getStockStatus(item.stock);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <span class="max-tablet:inline hidden text-text-color/80 mr-1">ID:</span>${item.id}
            </td>
            <td class="name">${item.name}</td>
            <td>${item.category}</td>
            <td>
                <span class="status-badge ${status.class}">${status.label}</span>
                <span class="text-black font-bold text-[13px] ml-2">${item.stock} units</span>
            </td>
            <td>${parseFloat(item.price).toFixed(2)} DH</td>
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

// Apply Filters button
applyFiltersBtn.addEventListener("click", () => {
    activeFilters.category = filterCategory.value
    activeFilters.alphabetical = filterAlphabetical.checked
    activeFilters.descending = filterDescending.checked

    const statuses = []
    if (filterInStock.checked) statuses.push("in-stock")
    if (filterLowStock.checked) statuses.push("low-stock")
    if (filterOutStock.checked) statuses.push("out-stock")
    activeFilters.stockStatus = statuses

    activeFilters.priceMin = filterPriceMin.value ? parseFloat(filterPriceMin.value) : null
    activeFilters.priceMax = filterPriceMax.value ? parseFloat(filterPriceMax.value) : null

    renderTable()
})

// Clear All button
clearFiltersBtn.addEventListener("click", () => {
    resetFilterUI()
    renderTable()
})

renderTable();

add_done_btn.addEventListener("click", async () => {
    const newProduct = {
        name: add_product_pop.querySelector("#name").value,
        category: add_product_pop.querySelector("#category").value,
        stock: parseInt(add_product_pop.querySelector("#stock").value) || 0,
        price: parseFloat(add_product_pop.querySelector("#price").value) || 0,
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
    });
    resetFilterUI()
    renderTable();
})


tbody.addEventListener("click", async (e) => {
    if (e.target.closest(".edit-product-btn")) {
        let tr = e.target.closest("tr")
        let id = parseInt(tr.querySelector("td:nth-child(1)").textContent.replace('ID:', ''))

        current_tr = id;

        const inventory = await fetch(API_URL).then(res => res.json());
        const item = inventory.find(p => p.id === id);

        if (item) {
            edit_product_pop.querySelector("#name").value = item.name
            edit_product_pop.querySelector("#category").value = item.category
            edit_product_pop.querySelector("#stock").value = item.stock
            edit_product_pop.querySelector("#price").value = item.price
            pop_up_toggle(edit_product_pop)
        }
    }
    if (e.target.closest(".delete-product-btn")) {
        let tr = e.target.closest("tr")
        let id = parseInt(tr.querySelector("td:nth-child(1)").textContent.replace('ID:', ''))

        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        renderTable();
    }
})

edit_done_btn.addEventListener("click", async () => {
    const updatedProduct = {
        name: edit_product_pop.querySelector("#name").value,
        category: edit_product_pop.querySelector("#category").value,
        stock: parseInt(edit_product_pop.querySelector("#stock").value),
        price: parseFloat(edit_product_pop.querySelector("#price").value),
    };

    await fetch(`${API_URL}/${current_tr}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
    });

    renderTable();
})

search_input.addEventListener("input",(e)=>{
    let tr = document.querySelectorAll("tr")
    tr.forEach((tr) => { tr.classList.remove("hidden!") })
    tr.forEach((tr) => {
        let rowName = tr.querySelector("td.name")
        if(rowName){
            if (!rowName.textContent.toLowerCase().includes(e.target.value.toLowerCase())){
                tr.classList.add("hidden!")
            }
        }
    })
})