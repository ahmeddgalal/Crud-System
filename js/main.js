"use strict";
// ----------------- Get Elements -----------------
const btnAddProduct = document.getElementById("addProduct");
const btnUpdateProduct = document.getElementById("updateProduct");
const btnClearForm = document.getElementById("clearForm");
const deleteAllData = document.getElementById("deleteAllData");
const productInputName = document.getElementById("productInputName");
const productInputPrice = document.getElementById("productInputPrice");
const productInputCategory = document.getElementById("productInputCategory");
const productInputDes = document.getElementById("productInputDes");
const productSearch = document.getElementById("productSearch");
const tableBody = document.getElementById("tableData");
const totaProduct = document.getElementById("totaProduct");
const inputs = Array.from(
   document.querySelectorAll(".crud-data .form-control")
);
const inValidAll = document.querySelector(".all-valid");
// ----------------- Global Variables -----------------
let products = [];
let curentIndexUpdate;
// ----------------- When Start -----------------
(() => {
   if (GetStorage() != null) {
      products = GetStorage();
      displayProducts(true);
   }
})();
// ----------------- Functions -----------------
// Get Data For Products
function getProdut() {
   let product = {
      name: productInputName.value,
      price: productInputPrice.value,
      category: productInputCategory.value,
      descrip: productInputDes.value,
   };
   products.push(product);
}
// Display Data In Table Or Display Search
function displayProducts(defaultDisplayOrSearch) {
   // if == true deafult display if nothing set undefind
   let tableData = "";
   products.forEach((item, index) => {
      // when send true return true , when send undefind send  return false so this return antohr code after :
      let checkSearch = defaultDisplayOrSearch
         ? true
         : item.name.toUpperCase().includes(productSearch.value.toUpperCase());
      if (checkSearch) {
         let colorText = defaultDisplayOrSearch
            ? item.name
            : item.name
                 .toLowerCase()
                 .replace(
                    productSearch.value.toLowerCase(),
                    `<span class="text-bg-secondary ">${productSearch.value.toLowerCase()}</span>`
                 );
         tableData += `
         <tr>
         <td>${index + 1}</td>
         <td>${colorText}</td>
         <td>${item.price}</td>
         <td>${item.category}</td>
         <td>${item.descrip}</td>
         <td>
            <i
               class="fa-solid fa-pen-to-square me-1 text-secondary icon-table"
               id="btnEdit"
               onclick="getUpdateInfo(${index})"
            ></i>
            <i class="fa-solid fa-trash-can text-danger icon-table" id="btnDelete"
            onclick="deleteRow(${index})"
            ></i>
         </td>
      </tr>
         `;
      }
   });
   tableBody.innerHTML = tableData;
   totaProduct.innerHTML = products.length;
}
// Reset Form
function resetForm() {
   inputs.forEach((input) => {
      input.value = "";
      input.classList.remove("is-valid");
      input.classList.remove("is-invalid");
   });
   productSearch.value = "";
}
// Delete Row
function deleteRow(index) {
   Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
   }).then((result) => {
      if (result.isConfirmed) {
         products.splice(index, 1);
         displayProducts(true);
         setStorage();
         Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
   });
}
// Get Update Info
function getUpdateInfo(index) {
   btnAddProduct.classList.add("d-none");
   btnUpdateProduct.classList.remove("d-none");
   curentIndexUpdate = index;
   let productsValue = Object.values(products[index]);
   inputs.forEach((input, indexInput) => {
      input.value = productsValue[indexInput];
   });
}
// Update Row
function updateRow() {
   let product = {
      name: productInputName.value,
      price: productInputPrice.value,
      category: productInputCategory.value,
      descrip: productInputDes.value,
   };
   if (!inputs.find((input) => input.classList.contains("is-invalid"))) {
      products[curentIndexUpdate] = product;
      displayProducts(true);
      setStorage();
      resetForm();
      Swal.fire("Updated!", "Success", "success");
      btnAddProduct.classList.remove("d-none");
      btnUpdateProduct.classList.add("d-none");
   }
}
// Set Data To Local Storage
function setStorage() {
   localStorage.setItem("Products", JSON.stringify(products));
}
// Get Data To Local Storage
function GetStorage() {
   return JSON.parse(localStorage.getItem("Products"));
}
// Check Validation for Regex
function regexCheck(element, regexCode) {
   element.addEventListener("input", function () {
      if (this.value != "") {
         if (regexCode.test(this.value)) {
            this.classList.add("is-valid");
            this.classList.remove("is-invalid");
         } else {
            this.classList.add("is-invalid");
            this.classList.remove("is-valid");
         }
      } else {
         this.classList.remove("is-invalid");
         this.classList.remove("is-valid");
      }
      inValidAll.classList.remove("d-block");
   });
}
// function to add product
const addProduct = () => {
   let checkValid = 0; // for plus 1 evry time loop
   inputs.forEach((input) => {
      if (input.value == "") {
         inValidAll.classList.add("d-block");
      }
      if (input.classList.contains("is-valid")) {
         checkValid++;
         if (checkValid == inputs.length) {
            // when check == inputs length it should be all data valid
            getProdut();
            displayProducts(true);
            setStorage();
            resetForm();
            Swal.fire("Add Product!", "Success", "success");
            inValidAll.classList.remove("d-block");
         }
      }
   });
};
// delte all data
function deletetableData() {
   Swal.fire({
      title: "Delete All Data?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete all!",
   }).then((result) => {
      if (result.isConfirmed) {
         products.splice(0);
         setStorage();
         displayProducts(true);
         Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
   });
}
// ----------------- Events -----------------
// button Add Product
btnAddProduct.addEventListener("click", addProduct);
// button Update Product
btnUpdateProduct.addEventListener("click", () => {
   updateRow();
});
// button Clear Form
btnClearForm.addEventListener("click", resetForm);
// Search Product
productSearch.addEventListener("input", () => {
   displayProducts();
});
// Delete all data
deleteAllData.addEventListener("click", deletetableData);
// key up
addEventListener("keyup", (e) => {
   if (e.key == "Enter") {
      btnAddProduct.classList.contains("d-none") ? updateRow() : addProduct();
   } else if (e.key == "Escape") {
      resetForm();
   }
});
// ----------------- Regex -----------------
let textRegex =
   /^(?:[a-zA-Z\d\s@,=%$#&_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF])){0,80}$/;
let numRegex = /^\d{0,8}(\.\d{1,4})?$/;
regexCheck(productInputName, textRegex);
regexCheck(productInputPrice, numRegex);
regexCheck(productInputCategory, textRegex);
regexCheck(productInputDes, textRegex);
