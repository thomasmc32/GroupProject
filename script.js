// Committed by Algassim Bah

// ---- SHOPPER MANAGEMENT ----
const shopperForm = document.getElementById("shopperForm");
const email = document.getElementById("email");
const nameInput = document.getElementById("name");
const phone = document.getElementById("phone");
const age = document.getElementById("age");
const address = document.getElementById("address");
const shopperOutput = document.getElementById("shopperOutput");

function validateShopper() {
    let ok = true;
    [email, nameInput, phone, age, address].forEach((el) => el.classList.remove("is-invalid"));

    if (!email.value.trim() || !email.checkValidity()) ok = false;
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) ok = false;
    const ageNum = Number(age.value);
    if (!age.value || Number.isNaN(ageNum) || ageNum < 1 || ageNum > 120) ok = false;
    if (!address.value.trim() || address.value.trim().length < 5) ok = false;

    const digits = phone.value.replace(/\D/g, "");
    if (phone.value.trim() && digits.length !== 10) ok = false;
    return ok;
}

shopperForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateShopper()) return alert("Please fill out all required shopper fields correctly.");

    const shopperData = {
        email: email.value.trim(),
        name: nameInput.value.trim(),
        "contact-phone": phone.value.trim(),
        age: age.value.trim(),
        address: address.value.trim(),
    };
    shopperOutput.textContent = JSON.stringify(shopperData, null, 2);
});

// ---- PRODUCT MANAGEMENT ----
const productForm = document.getElementById("productForm");
const productId = document.getElementById("productId");
const productDesc = document.getElementById("productDesc");
const productCategory = document.getElementById("productCategory");
const productUOM = document.getElementById("productUOM");
const productPrice = document.getElementById("productPrice");
const productWeight = document.getElementById("productWeight");
const productOutput = document.getElementById("productOutput");

let productList = [];

function validateProduct() {
    let ok = true;
    [productId, productDesc, productCategory, productUOM, productPrice].forEach((el) => el.classList.remove("is-invalid"));
    if (!productId.value.trim()) ok = false;
    if (!productDesc.value.trim()) ok = false;
    if (!productCategory.value) ok = false;
    if (!productUOM.value) ok = false;
    if (!productPrice.value || productPrice.value <= 0) ok = false;
    return ok;
}

productForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateProduct()) return alert("Please fill all required product fields.");

    const productData = {
        productId: productId.value.trim(),
        productDesc: productDesc.value.trim(),
        productCategory: productCategory.value,
        productUOM: productUOM.value,
        productPrice: parseFloat(productPrice.value).toFixed(2),
        productWeight: productWeight.value.trim() || "N/A",
    };
    productOutput.textContent = JSON.stringify(productData, null, 2);

    productList.push(productData);
});

// ---- Shopping Cart ----
let cart = [];

const searchInput = document.getElementById("searchProduct");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");
const cartTable = document.getElementById("cartTable");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartOutput = document.getElementById("cartOutput");

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    const results = productList.filter(p => p.productDesc.toLowerCase().includes(query));
    renderSearchResults(results);
});

function renderSearchResults(results) {
    searchResults.innerHTML = "";
    results.forEach(item => {
        const row = document.createElement("tr");
row.innerHTML = `
    <td>${item.productId}</td>
    <td>${item.productDesc}</td>
    <td>${item.productCategory}</td>
    <td>$${parseFloat(item.productPrice).toFixed(2)}</td>
    <td><button class="btn btn-sm btn-success addBtn" data-id="${item.productId}">Add</button></td>
`;

        searchResults.appendChild(row);
    });

    document.querySelectorAll(".addBtn").forEach(btn => {
        btn.addEventListener("click", () => addToCart(btn.dataset.id));
    });
}

function addToCart(id) {
    const product = productList.find(p => p.productId === id);
    if (!product) return;

    const existing = cart.find(c => c.productId === id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });

    renderCart();
}

function renderCart() {
    cartTable.innerHTML = "";
    cart.forEach(item => {
        const row = document.createElement("tr");
        const total = parseFloat(item.productPrice) * item.quantity;
        row.innerHTML = `
            <td>${item.productId}</td>
            <td>${item.productDesc}</td>
            <td><input type="number" min="1" class="form-control form-control-sm qtyInput" data-id="${item.productId}" value="${item.quantity}"></td>
            <td>$${parseFloat(item.productPrice).toFixed(2)}</td>
            <td>$${total.toFixed(2)}</td>
            <td><button class="btn btn-sm btn-danger removeBtn" data-id="${item.productId}">X</button></td>
        `;
        cartTable.appendChild(row);
    });

    document.querySelectorAll(".qtyInput").forEach(input => {
        input.addEventListener("input", () => {
            const item = cart.find(c => c.productId === input.dataset.id);
            item.quantity = parseInt(input.value) || 1;
            renderCart();
        });
    });

    document.querySelectorAll(".removeBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            cart = cart.filter(c => c.productId !== btn.dataset.id);
            renderCart();
        });
    });
}


}

checkoutBtn.addEventListener("click", () => {
    const cartDoc = cart.map(i => ({
        id: i.productId,
        name: i.productDesc,
        category: i.productCategory,
        price: i.productPrice,
        total: (parseFloat(i.productPrice) * i.quantity).toFixed(2)
    }));
    cartOutput.textContent = JSON.stringify(cartDoc, null, 2);
});