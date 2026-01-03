const locations = ["library", "canteen", "gym"];

function getStatus(count, capacity) {
  const percent = Math.round((count / capacity) * 100);

  if (percent < 30)
    return { text: "Low 🟢", cls: "low", bar: "low-bar", rec: "Recommended 👍" };

  if (percent < 70)
    return { text: "Medium 🟡", cls: "medium", bar: "medium-bar", rec: "Plan accordingly ⚠️" };

  return { text: "High 🔴", cls: "high", bar: "high-bar", rec: "Avoid right now ❌" };
}

locations.forEach((loc) => {
  db.collection("locations").doc(loc).onSnapshot((doc) => {
    if (!doc.exists) return;

    const data = doc.data();
    const card = document.getElementById(loc);

    const statusEl = card.querySelector(".status");
    const barEl = card.querySelector(".bar");
    const recEl = card.querySelector(".recommendation");
    const timeEl = card.querySelector(".time");

    const status = getStatus(data.currentCount, data.capacity);
    const percent = Math.min(100, (data.currentCount / data.capacity) * 100);

    statusEl.textContent = `${status.text} (${Math.round(percent)}%)`;
    statusEl.className = `status ${status.cls}`;

    barEl.style.width = percent + "%";
    barEl.className = `bar ${status.bar}`;

    recEl.textContent = status.rec;

    timeEl.textContent = "Last updated: " +
      (data.lastUpdated?.toDate().toLocaleTimeString() || "just now");
  });
});

/* QR Auto Check-in */
const params = new URLSearchParams(window.location.search);
const scanned = params.get("location");

if (scanned && locations.includes(scanned)) {
  db.collection("locations").doc(scanned).update({
    currentCount: firebase.firestore.FieldValue.increment(1),
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  });
}
