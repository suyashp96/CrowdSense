const scanner = new Html5Qrcode("reader");

scanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  (decodedText) => {
    alert("Check-in successful!\n" + decodedText);
    scanner.stop();
  },
  () => {}
);
