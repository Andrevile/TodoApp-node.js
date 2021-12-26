const writeRequest = (e) => {
  console.log("ett");
  const testFormData = new FormData(document.getElementById("test_form"));
  console.log(testFormData);
  fetch("http://localhost:8080/add", {
    method: "POST",
    cache: " no-cache",
    headers: {},
    body: testFormData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
  e.preventdefault();
};
