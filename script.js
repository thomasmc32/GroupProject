
const form = document.getElementById("shopperForm");
const email = document.getElementById("email");
const nameInput = document.getElementById("name");
const phone = document.getElementById("phone");
const age = document.getElementById("age");
const address = document.getElementById("address");
const output = document.getElementById("jsonOutput");

function setInvalid(input, message) {
    input.classList.add("is-invalid");
    const feedback = input.parentElement.querySelector(".invalid-feedback");
    if (feedback) feedback.textContent = message || "Invalid value.";
}

function clearInvalid(input) {
    input.classList.remove("is-invalid");
    const feedback = input.parentElement.querySelector(".invalid-feedback");
    if (feedback) feedback.textContent = "";
}

function validate() {
    let ok = true;
    [email, nameInput, phone, age, address].forEach(clearInvalid);

    if (!email.value.trim() || !email.checkValidity()) {
        setInvalid(email, "Please enter a valid email address.");
        ok = false;
    }

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setInvalid(nameInput, "Name is required (min 2 characters).");
        ok = false;
    }

    const ageNum = Number(age.value);
    if (!age.value || Number.isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        setInvalid(age, "Age is required (1–120).");
        ok = false;
    }

    if (!address.value.trim() || address.value.trim().length < 5) {
        setInvalid(address, "Address is required (min 5 characters).");
        ok = false;
    }

    const digits = phone.value.replace(/\D/g, "");
    if (phone.value.trim() && digits.length !== 10) {
        setInvalid(phone, "If provided, phone must be 10 digits.");
        ok = false;
    }

    return ok;
}

[email, nameInput, phone, age, address].forEach((el) => {
    el.addEventListener("input", () => {
        if (el.classList.contains("is-invalid")) {
            validate();
        }
    });
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validate()) {
        return;
    }

    const shopperData = {
        email: email.value.trim(),
        name: nameInput.value.trim(),
        "contact-phone": phone.value.trim(),
        age: age.value.trim(),
        address: address.value.trim(),
    };

    output.textContent = JSON.stringify(shopperData, null, 2);
});