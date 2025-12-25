document.addEventListener("DOMContentLoaded", async () => {
	const userId = localStorage.getItem("id");
	if (!userId) {
		alert("لطفاً ابتدا وارد شوید.");
		return;
	}

	try {
		const res = await fetch(`/api/user/${userId}`, {
			method: "GET",
		});
		if (!res.ok) throw new Error("خطا در دریافت اطلاعات کاربر");

		const user = await res.json();

		document.getElementById("username").value = user.username;
		document.getElementById("email").value = user.email;
	} catch (err) {
		console.error(err);
		alert("مشکلی در دریافت اطلاعات رخ داد.");
	}
});

document.getElementById("profileForm").addEventListener("submit", async (e) => {
	e.preventDefault();

	const userId = localStorage.getItem("id");
	const updatedUsername = document.getElementById("username").value.trim();
	const newPassword = document.getElementById("password").value;

	const body = {
		username: updatedUsername,
	};
	if (newPassword) body.password = newPassword;

	try {
		const res = await fetch(`/api/user/${userId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.message || "خطا در بروزرسانی");

		alert("اطلاعات با موفقیت بروزرسانی شد");
		document.getElementById("password").value = ""; // clear password field
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
});
