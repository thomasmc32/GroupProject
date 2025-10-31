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
    const results = productList.filter(p => p.name.toLowerCase().includes(query));
    renderSearchResults(results);
});

function renderSearchResults(results) {
    searchResults.innerHTML = "";
    results.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><button class="btn btn-sm btn-success addBtn" data-id="${item.id}">Add</button></td>
        `;
        searchResults.appendChild(row);
    });

    document.querySelectorAll(".addBtn").forEach(btn => {
        btn.addEventListener("click", () => addToCart(btn.dataset.id));
    });
}

function addToCart(id) {
    const product = productlist.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(c => c.id === id);
    if (existing) existing.quantity--;
    else cart.push({ ...product, quantity: 1 });

    renderCart();
}

function renderCart() {
    cartTable.innerHTML = "";
    cart.forEach(item => {
        const row = document.createElement("tr");
        const total = item.quantity * item.price;
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td><input type="number" min="1" class="form-control form-control-sm qtyInput" data-id="${item.id}" value="${item.quantity}"></td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${total.toFixed(2)}</td>
            <td><button class="btn btn-sm btn-danger removeBtn" data-id="${item.id}">X</button></td>
        `;
        cartTable.appendChild(row);
    });

    document.querySelectorAll(".qtyInput").forEach(input => {
        input.addEventListener("input", () => {
            const item = cart.find(c => c.id === input.dataset.id);
            item.quantity = parseInt(input.value) || 1;
            renderCart();
        });
    });

    document.querySelectorAll(".removeBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            cart = cart.filter(c => c.id !== btn.dataset.id);
            renderCart();
        });
    });
}

checkoutBtn.addEventListener("click", () => {
    const cartDoc = cart.map(i => ({
        id: i.id,
        name: i.name,
        category: i.category,
        quantity: i.quantity,
        price: i.price,
        total: (i.price * i.quantity).toFixed(2)
    }));
    cartOutput.textContent = JSON.stringify(cartDoc, null, 2);
});
$("#searchBtn").off("click").on("click", function () {
    const query = $("#searchProduct").val().trim().toLowerCase();
    if (!query) return alert("Enter a product name to search.");

    const found = products.find(p => p.description.toLowerCase().includes(query));
    if (found) {
        addToCart(found);
        alert(`"${found.description}" added to cart.`);
    } else {
        alert("Product not found. Make sure it’s added in Product Management first.");
    }
});

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            description: product.description,
            price: product.price,
            qty: 1
        });
    }
    updateCart();
}

function updateCart() {
    const tbody = $("#cartTable");
    tbody.empty();

    cart.forEach((item, index) => {
        const total = (item.price * item.qty).toFixed(2);
        tbody.append(`
            <tr>
                <td>${item.id}</td>
                <td>${item.description}</td>
                <td>${item.qty}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${total}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">X</button></td>
            </tr>
        `);
    });

    $("#cartOutput").text(JSON.stringify(cart, null, 2));
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}


$("#checkoutBtn").off("click").on("click", function () {
    if (cart.length === 0) {
        alert("Cart is empty. Please add items before checkout.");
        return;
    }

    $.ajax({
        url: "/echo/json/",  // Temporary echo endpoint for testing
        type: "POST",
        data: JSON.stringify(cart),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            console.log("AJAX Success:", response);
            $("#cartOutput").html(JSON.stringify(response, null, 2));
            alert("Cart JSON sent successfully!");
        },
        error: function () {
            console.error("AJAX Error");
            alert("Error sending cart JSON.");
        }
    });
});
$("#checkoutBtn").off("click").on("click", function () {
    if (cart.length === 0) {
        alert("Cart is empty. Please add products before sending.");
        return;
    }

    const cartJSON = JSON.stringify(cart, null, 2);

    console.log("Sending this JSON:", cartJSON);
    $("#cartOutput").html("<b>Sending JSON...</b><br><pre>" + cartJSON + "</pre>");

    $.ajax({
        url: "https://httpbin.org/post",
        type: "POST",
        data: cartJSON,
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            console.log("Response received:", response);
            $("#cartOutput").html("<b>Response Received:</b><br><pre>" + JSON.stringify(response, null, 2) + "</pre>");
            alert("AJAX transport successful!");
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", status, error);
            alert("There was an error sending your JSON.");
        }
    });
});