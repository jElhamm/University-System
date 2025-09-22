document.addEventListener("DOMContentLoaded", () => {
  const semesterSelect = document.getElementById("semesterSelect");
  const coursesTable = document.getElementById("coursesTable");
  const tbody = coursesTable.querySelector("tbody");
  const noCourses = document.getElementById("noCourses");

  // دریافت لیست ترم‌ها
  fetch("/api/semesters")
    .then(res => res.json())
    .then(semesters => {
      semesters.forEach(sem => {
        const opt = document.createElement("option");
        opt.value = sem;
        opt.textContent = sem;
        semesterSelect.appendChild(opt);
      });
    });

  // هنگام انتخاب ترم
  semesterSelect.addEventListener("change", () => {
    const semester = semesterSelect.value;
    tbody.innerHTML = "";
    coursesTable.style.display = "none";
    noCourses.style.display = "none";
    if (!semester) return;

    fetch(`/api/courses?semester=${encodeURIComponent(semester)}`)
      .then(res => res.json())
      .then(courses => {
        if (!courses.length) {
          noCourses.style.display = "block";
          return;
        }
        courses.forEach(c => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${c.code}</td>
            <td>${c.name}</td>
            <td>${c.group}</td>
            <td>${c.professor}</td>
            <td>${c.units}</td>
          `;
          tbody.appendChild(tr);
        });
        coursesTable.style.display = "table";
      });
  });
});