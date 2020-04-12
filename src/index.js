import { parse, print } from "./parse.js";

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

window.openFile = function (event) {
  const input = event.target;
  const reader = new FileReader();

  reader.onload = function (e) {
    const orders = parse(reader.result);

    download("export_articles.csv", print(orders));
  };

  reader.readAsText(input.files[0]);
};
