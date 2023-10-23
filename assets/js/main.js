const title = document.querySelector(".title")
const price = document.querySelector(".price")
const taxes = document.querySelector(".taxes")
const ads = document.querySelector(".ads")
const discount = document.querySelector(".discount")
const count = document.querySelector(".count")
const category = document.querySelector(".category")
const total = document.querySelector(".total")
const creat = document.querySelector(".creat");

const ul = document.querySelector("ul.tags");
const tbody = document.querySelector("table tbody");

/* local storage */

let storeArray = [];

if (localStorage.getItem("crud")) {
    storeArray = JSON.parse(localStorage.getItem("crud"));
};

getProductFromLocalStorage(storeArray);


/* ----------- */

[price, taxes, ads, discount].forEach(inp => {
    inp.addEventListener("input", (e) => {
        if (price.value != "" && taxes.value != "") {
            total.innerText = `Total: ${(+price.value + +taxes.value + +ads.value) - +discount.value}`;
            total.style.backgroundColor = "rgba(0, 255, 0, 0.421)";
        } else {
            total.innerText = "Total:";
            total.style.backgroundColor = "rgba(255, 0, 0, 0.421)";
        };
    });
});


creat.addEventListener("click", (e) => {
    const [titleValue,
        priceValue_num,
        taxesValue_num,
        adsValue_num,
        discountValue_num,
        countValue_num,
        categoryValue] = [
            title.value,
            Number(price.value),
            Number(taxes.value),
            Number(ads.value),
            Number(discount.value),
            Number(count.value) || 1,
            category.value
        ];

    if (titleValue == "" ||
        priceValue_num == "" ||
        taxesValue_num == "" ||
        categoryValue == "") return;

    let id = getId();
    let productObj = {
        product_id: id,
        product_title: titleValue,
        product_price: priceValue_num,
        product_taxe: taxesValue_num,
        product_ads: adsValue_num,
        product_discount: discountValue_num,
        product_priceTotal: (priceValue_num + taxesValue_num + adsValue_num) - discountValue_num,
        product_category: categoryValue,
        product_howMany: countValue_num
    };

    storeArray.push(productObj);
    localStorage.setItem("crud", JSON.stringify(storeArray));

    for (let i = 0; i < countValue_num; i++) {
        tbody.innerHTML += `
            <tr class="category-all category-${categoryValue}">
            <td data-cell="id">${id}</td>
            <td data-cell="title">${titleValue}</td>
            <td data-cell="price">${priceValue_num}</td>
            <td data-cell="taxes">${taxesValue_num}</td>
            <td data-cell="discount">${discountValue_num}</td>
            <td data-cell="ads">${adsValue_num}</td>
            <td data-cell="total">${(priceValue_num + taxesValue_num + adsValue_num) - discountValue_num}</td>
            <td data-cell="category">${categoryValue}</td>
            <td data-cell="action">
              <button class="delete">Delete</button>
            </td>
            </tr>
        `
    };


    [title, price, taxes, ads, discount, count, category].forEach(inp => {
        inp.value = "";
    });

    total.innerText = "Total:";
    total.style.backgroundColor = "rgba(255, 0, 0, 0.421)";

    if (!ul.querySelector(`[data-category="category-${categoryValue}"]`)) {
        ul.innerHTML += `
          <li data-category="category-${categoryValue}">${categoryValue}</li>
        `;
    };
    tagsHandler();
});



function tagsHandler() {
    const tags = document.querySelectorAll("ul.tags li");
    /* filter ul */
    tags.forEach(tag => {
        tag.addEventListener("click", (e) => {
            const aLL_tr = document.querySelectorAll("table tbody tr");
            tags.forEach(li => {
                li.classList.remove("active")
            })
            tag.classList.add("active")

            aLL_tr.forEach(tr => {
                tr.style.display = "none";
            })
            document.querySelectorAll(`.${tag.dataset.category}`).forEach(tr => {
                tr.style.display = "table-row";
            })
        })
    })
}

function getId() {
    let numberOfCharacters = "123456789";
    let arr_id = [];
    for (let i = 0; i < 4; i++) {
        arr_id.push(numberOfCharacters[Math.floor(Math.random() * numberOfCharacters.length)])
    }
    return arr_id.join("")
}

function getProductFromLocalStorage(storeArray) {
    for (let i = 0; i < storeArray.length; i++) {
        let currentProduct = storeArray[i];
        for (let j = 0; j < currentProduct.product_howMany; j++) {
            tbody.innerHTML += `
                <tr class="category-all category-${currentProduct.product_category}">
                <td data-cell="id">${currentProduct.product_id}</td>
                <td data-cell="title">${currentProduct.product_title}</td>
                <td data-cell="price">${currentProduct.product_price}</td>
                <td data-cell="taxes">${currentProduct.product_taxe}</td>
                <td data-cell="discount">${currentProduct.product_discount}</td>
                <td data-cell="ads">${currentProduct.product_ads}</td>
                <td data-cell="total">${currentProduct.product_priceTotal}</td>
                <td data-cell="category">${currentProduct.product_category}</td>
                <td data-cell="action">
                  <button class="delete">Delete</button>
                </td>
                </tr>
            `
        }
        if (!ul.querySelector(`[data-category="category-${currentProduct.product_category}"]`)) {
            ul.innerHTML += `
              <li data-category="category-${currentProduct.product_category}">${currentProduct.product_category}</li>
            `;
        };
    };
    tagsHandler()
}


document.documentElement.addEventListener("click", ({ target }) => {
    if (!target.classList.contains("delete")) return;

    let trOfTarget = target.closest("tr");
    let trId = trOfTarget.querySelector("[data-cell='id']").innerText;

    let storageData = JSON.parse(localStorage.getItem("crud"));

    let wantedObjIndex = null;
    for (let i = 0; i < storageData.length; i++) {
        if (storageData[i]["product_id"] === trId) {
            wantedObjIndex = i;
        }
    }

    if (storageData[wantedObjIndex].product_howMany == 1) {
        let storageData_removed = storageData.filter(el => {
            return el != storageData[wantedObjIndex]
        });
        trOfTarget.remove()
        localStorage.setItem("crud", JSON.stringify(storageData_removed))
        return;
    }

    storageData[wantedObjIndex].product_howMany -= 1;
    localStorage.setItem("crud", JSON.stringify(storageData))
    trOfTarget.remove()

})