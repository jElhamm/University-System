// دریافت و نمایش لیست اخبار
fetch("/api/news")
  .then(res => res.json())
  .then(news => {
    const newsList = document.getElementById("newsList");
    news.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td class="clickable" onclick="showDetails(${index})">${item.title}</td>
      `;
      newsList.appendChild(row);
    });
    window.newsData = news;
  });

// تابع کمکی برای تبدیل \n به <br>
function formatText(text) {
  return text.replace(/\n/g, "<br>");
}

// نمایش جزییات خبر
function showDetails(index) {
  const data = window.newsData[index];
  document.getElementById("newsTitle").textContent = data.title;
  document.getElementById("newsImage").src = data.image || "";
  document.getElementById("newsImage").style.display = data.image ? "block" : "none";
  document.getElementById("newsBody").innerHTML = formatText(data.body); // استفاده از innerHTML برای نمایش صحیح
  document.getElementById("newsDetails").classList.remove("hidden");
}

// بستن پنجره جزییات خبر
function closeDetails() {
  document.getElementById("newsDetails").classList.add("hidden");
}
