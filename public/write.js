function writeRequest(e) {
  console.log("ett");
  const testFormData = new FormData(document.getElementById("test_form"));
  console.log(testFormData);
  fetch("./add", {
    method: "POST",
    cache: "no-cache",
    headers: { "Content-Type": "application/json" },
    body: testFormData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
  // e.preventdefault();
}
