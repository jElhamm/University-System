document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("requestForm");
  const title = document.getElementById("reqTitle");
  const from = document.getElementById("reqFrom");
  const body = document.getElementById("reqBody");
  const table = document.getElementById("requestsTable").querySelector("tbody");

  function fetchRequests() {
    fetch("/api/requests")
      .then(res => res.json())
      .then(requests => {
        table.innerHTML = "";
        requests.forEach((req, idx) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${requests.length - idx}</td>
            <td>${req.title}</td>
            <td>${req.from}</td>
            <td class="status-${req.status.replace(/\s/g, '-')}">${statusText(req.status)}</td>
          `;
          table.appendChild(tr);
        });
      });
  }

  function statusText(status) {
    switch (status) {
      case "submitted": return "ثبت شده";
      case "under review": return "در حال بررسی";
      case "approved": return "تایید شده";
      default: return status;
    }
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.value,
        from: from.value,
        body: body.value
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          form.reset();
          fetchRequests();
        } else {
          alert("خطا در ثبت درخواست");
        }
      });
  });

  fetchRequests();
});