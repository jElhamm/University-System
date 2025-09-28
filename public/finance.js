(() => {
  // داده‌های شبیه‌سازی شده (می‌تونی با API جایگزین کنی)
  let balance = 0; // مبلغ بستانکاری مثبت، بدهی منفی
  const transactions = [];

  // المان‌ها
  const balanceDisplay = document.getElementById("balance-display");
  const transactionsTableBody = document.querySelector("#transactions-table tbody");

  const paymentModal = document.getElementById("payment-modal");
  const btnOpenPayment = document.getElementById("btn-open-payment");
  const closePaymentModalBtn = document.getElementById("close-payment-modal");
  const paymentAmountInput = document.getElementById("payment-amount");
  const confirmPaymentBtn = document.getElementById("confirm-payment-btn");

  const debtModal = document.getElementById("debt-modal");
  const btnOpenDebt = document.getElementById("btn-add-debt");
  const closeDebtModalBtn = document.getElementById("close-debt-modal");
  const debtAmountInput = document.getElementById("debt-amount");
  const debtDescInput = document.getElementById("debt-desc");
  const confirmDebtBtn = document.getElementById("confirm-debt-btn");

  // بروزرسانی نمایش موجودی
  function updateBalanceDisplay() {
    if (balance >= 0) {
      balanceDisplay.textContent = balance.toLocaleString() + " تومان بستانکار";
      balanceDisplay.className = "positive";
    } else {
      balanceDisplay.textContent = (-balance).toLocaleString() + " تومان بدهکار";
      balanceDisplay.className = "negative";
    }
  }

  // افزودن تراکنش جدید به جدول
  function addTransactionRow(date, desc, amount, type) {
    const tr = document.createElement("tr");
    const dateTd = document.createElement("td");
    const descTd = document.createElement("td");
    const amountTd = document.createElement("td");
    const typeTd = document.createElement("td");

    const dateStr = new Date(date).toLocaleDateString("fa-IR");

    dateTd.textContent = dateStr;
    descTd.textContent = desc;
    amountTd.textContent = amount.toLocaleString();

    typeTd.textContent = type === "credit" ? "بستانکاری" : "بدهی";
    typeTd.className = "transaction-type " + type;

    tr.appendChild(dateTd);
    tr.appendChild(descTd);
    tr.appendChild(amountTd);
    tr.appendChild(typeTd);

    transactionsTableBody.prepend(tr);
  }

  // باز کردن و بستن مودال‌ها
  function openModal(modal) {
    modal.style.display = "flex";
  }
  function closeModal(modal) {
    modal.style.display = "none";
  }

  // رویدادهای دکمه‌ها
  btnOpenPayment.addEventListener("click", () => {
    paymentAmountInput.value = "";
    openModal(paymentModal);
  });

  closePaymentModalBtn.addEventListener("click", () => {
    closeModal(paymentModal);
  });

  btnOpenDebt.addEventListener("click", () => {
    debtAmountInput.value = "";
    debtDescInput.value = "";
    openModal(debtModal);
  });

  closeDebtModalBtn.addEventListener("click", () => {
    closeModal(debtModal);
  });

  // پرداخت و افزایش موجودی
  confirmPaymentBtn.addEventListener("click", () => {
    const val = Number(paymentAmountInput.value);
    if (isNaN(val) || val <= 0) {
      alert("لطفاً مبلغ معتبر وارد کنید.");
      return;
    }

    // اعمال پرداخت روی بدهی یا موجودی
    // اگر بدهی داریم (یعنی balance منفی است) ابتدا بدهی را کم می‌کنیم
    if (balance < 0) {
      let debt = -balance;
      if (val >= debt) {
        // پرداخت بیشتر از بدهی: بدهی صفر و مابقی بستانکاری می‌شود
        balance = val - debt;
      } else {
        // پرداخت کمتر از بدهی: بدهی کم می‌شود
        balance += val; // چون balance منفی است، جمع کردن باعث کم شدن بدهی می‌شود
      }
    } else {
      // اگر بدهی نیست، مبلغ به بستانکاری اضافه می‌شود
      balance += val;
    }

    // ثبت تراکنش پرداخت (بستانکاری)
    transactions.push({
      date: new Date(),
      desc: "پرداخت و افزایش موجودی",
      amount: val,
      type: "credit",
    });

    addTransactionRow(new Date(), "پرداخت و افزایش موجودی", val, "credit");
    updateBalanceDisplay();
    closeModal(paymentModal);
  });

  // ثبت بدهی جدید
  confirmDebtBtn.addEventListener("click", () => {
    const val = Number(debtAmountInput.value);
    const desc = debtDescInput.value.trim();

    if (isNaN(val) || val <= 0) {
      alert("لطفاً مبلغ بدهی معتبر وارد کنید.");
      return;
    }
    if (desc === "") {
      alert("لطفاً شرح بدهی را وارد کنید.");
      return;
    }

    // بدهی را به balance اضافه می‌کنیم (منفی)
    balance -= val;

    // ثبت تراکنش بدهی
    transactions.push({
      date: new Date(),
      desc: desc,
      amount: val,
      type: "debit",
    });

    addTransactionRow(new Date(), desc, val, "debit");
    updateBalanceDisplay();
    closeModal(debtModal);
  });

  // کلیک بیرون مودال برای بستن
  window.addEventListener("click", (e) => {
    if (e.target === paymentModal) closeModal(paymentModal);
    if (e.target === debtModal) closeModal(debtModal);
  });

  // بارگذاری اولیه صفحه
  function init() {
    updateBalanceDisplay();
  }
  init();
})();
