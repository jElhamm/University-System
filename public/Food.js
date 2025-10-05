// Fetch Food data
document.addEventListener ("DOMContentLoaded" , () => {
  fetch("/api/foods")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("food-list");
      data.forEach((food, index) => {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "food";
        input.id = `food-${index}`;
        input.value = food.name;
        input.style.display = "none";
  
        const label = document.createElement("label");
        label.classList.add("food-item");
        label.setAttribute("for", `food-${index}`);
  
        const img = document.createElement("img");
        img.src = food.image;
  
        const p = document.createElement("p");
        p.textContent = food.name;
  
        const span = document.createElement("span");
        span.textContent = `${Number(food.price).toLocaleString()} تومان`;
  
        label.appendChild(img);
        label.appendChild(p);
        label.appendChild(span);
  
        container.appendChild(input);
        container.appendChild(label);
      });
    })
    .catch((error) => console.error("Error loading food data:", error));
})

// Reserve
document.getElementById('ReserveForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const userId = localStorage.getItem("id");
  

  const selectedFoodInput = document.querySelector('input[name="food"]:checked');
  if (!selectedFoodInput) {
    alert("لطفاً یک غذا انتخاب کنید");
    return;
  }

  const date = document.getElementById('date').value;
  if (!date) {
    alert("لطفاً تاریخ را انتخاب کنید");
    return;
  }

  const restaurant = document.getElementById('restaurant').value;
  if (!restaurant) {
    alert("لطفاً رستوران را انتخاب کنید");
    return;
  }

  const formData = new FormData(e.target);
  formData.append("userId", userId);
  const data = new URLSearchParams(formData);

  fetch('/api/Reserve', {
    method: 'POST',
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      document.getElementById('ReserveForm').reset();
    })
    .catch((err) => {
      console.error('Error:', err);
      alert('رزرو با مشکل مواجه شد');
    });      
});

// receipt
document.getElementById("date").addEventListener("change", function () {
  const userId = localStorage.getItem("id");
  const date = this.value;

  fetch(`/api/reserves?userId=${userId}&date=${date}`)
    .then((res) => res.json())
    .then((data) => {
      const section = document.getElementById("list-section");
      const tbody = document.getElementById("order-list");
      tbody.innerHTML = "";

      if (data.length === 0) {
        section.style.display = "none";
        return;
      }

      data.forEach((reserve) => {
        const tr = document.createElement("tr");

        const dateTd = document.createElement("td");
        dateTd.textContent = new Date(reserve.reserveDate).toLocaleDateString("fa-IR");

        const foodTd = document.createElement("td");
        foodTd.textContent = reserve.foodName;

        const restaurantTd = document.createElement("td");
        restaurantTd.textContent = reserve.restaurantName;

        const priceTd = document.createElement("td");
        priceTd.textContent = `${Number(reserve.price).toLocaleString()} تومان`;

        const deleteTd = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "حذف";
        deleteBtn.onclick = () => {
          fetch(`/api/reserves/${reserve._id}`, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then((msg) => {
              alert(msg.message);
              tr.remove(); // Remove row from UI
              if (tbody.children.length === 0) {
                section.style.display = "none";
              }
            });
        };

        deleteTd.appendChild(deleteBtn);
        tr.append(dateTd, foodTd, restaurantTd, priceTd, deleteTd);
        tbody.appendChild(tr);
      });

      section.style.display = "block"; // Show table
    })
    .catch((err) => {
      console.error("Error loading reservations:", err);
    });
});

// // افزایش موجودی
// document.getElementById("add-balance-btn").addEventListener("click", function () {
//   const currentBalanceElement = document.getElementById("balance");
//   const currentBalance = parseInt(currentBalanceElement.textContent.replace(/,/g, ''));

//   const inputAmount = prompt("مبلغی که می‌خواهید اضافه کنید را وارد کنید:");
//   const amount = parseInt(inputAmount.replace(/,/g, ''));

//   if (!isNaN(amount) && amount > 0) {
//     const newBalance = currentBalance + amount;
//     currentBalanceElement.textContent = newBalance.toLocaleString();
//     alert(`موجودی با موفقیت به ${newBalance.toLocaleString()} تومان افزایش یافت.`);
//   } else {
//     alert("مقدار وارد شده معتبر نیست.");
//   }
// });

const modal = document.getElementById("balance-modal");
const btn = document.getElementById("add-balance-btn");
const closeBtn = document.getElementById("close-modal");
const confirmBtn = document.getElementById("confirm-add-balance");
const balanceElement = document.getElementById("balance");
const inputField = document.getElementById("balance-input");

// باز کردن مودال هنگام کلیک روی دکمه
btn.addEventListener("click", () => {
  inputField.value = "";
  modal.style.display = "flex";
  inputField.focus();
});

// بستن مودال با کلیک روی ×
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// بستن مودال با کلیک بیرون از محتوا
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// تایید و افزایش موجودی
confirmBtn.addEventListener("click", () => {
  const inputValue = parseInt(inputField.value);
  if (isNaN(inputValue) || inputValue <= 0) {
    alert("لطفاً یک عدد معتبر وارد کنید.");
    inputField.focus();
    return;
  }

  // موجودی فعلی بدون کاما
  const currentBalance = parseInt(balanceElement.textContent.replace(/,/g, ""));
  const newBalance = currentBalance + inputValue;

  balanceElement.textContent = newBalance.toLocaleString();

  alert(`موجودی با موفقیت به ${newBalance.toLocaleString()} تومان افزایش یافت.`);
  modal.style.display = "none";
});
