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
});