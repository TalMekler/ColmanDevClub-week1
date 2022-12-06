var uploadBtn = document.getElementById("upload-file-btn");
var sizeUnitElements = document.getElementsByClassName("size-unit");

for (var i = 0; i < sizeUnitElements.length; i++) {
  sizeUnitElements[i].innerHTML = "MB";
}
var totalSize = 100;
const maxSizeElement = document.getElementById("max-size");
var usedSize = 0;
const usedSizeElement = document.getElementById("used-size");
const remainSizeElement = document.getElementById("remain-size");
const progressBarClr = document.getElementById("progress-bar-clr");
const progressBarCircle = document.getElementById("progress-bar-circle");
var uploadedFilesWrapper = document.getElementById("uploaded-files-wrapper");

var fileName;
var validFile;
var fileSize;
// window.localStorage.setItem("usedSize", 0);
updateSizes();
uploadBtn.addEventListener("change", () => {
  fileName = uploadBtn.value;
  validFile = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileName);
  console.log(validFile);
  if (!validFile) {
    alert("Invalid file type!");
  } else {
    fileSize = uploadBtn.files[0];
    fileSize = parseFloat(parseFloat(fileSize.size / 1000 / 1000).toFixed(2));
    usedSize += fileSize;
    if (usedSize > totalSize) {
      alert("Not enough size!");
      usedSize -= fileSize;
    } else {
      window.localStorage.setItem("usedSize", usedSize);
      updateSizes();
      uploadedFilesWrapper.innerHTML +=
        '<div class="uploaded-file__item" file-size="'+fileSize+'"><p class="uploaded-file__item-text"><span>'+ fileName +'</span><i class="fa-solid fa-xmark" onclick="removeItem(this)"></i></p></div>';
    }
  }
  uploadBtn.value = "";
});

function updateSizes() {
  usedSize = parseFloat(JSON.parse(window.localStorage.getItem("usedSize")).toFixed(2));
  usedSizeElement.innerText = usedSize.toFixed(2);
  remainSizeElement.innerHTML = (totalSize - usedSize).toFixed(2);
  maxSizeElement.innerText = totalSize;
  progressBarClr.style.width = (usedSize / totalSize) * 100 + "%";

  if (usedSize > 0) progressBarCircle.style.right = "0";
  else progressBarCircle.style.right = "-10px";
}

document.getElementById("zero-size").addEventListener("click", () => {
  reset();
});

function reset() {
  uploadedFilesWrapper.innerHTML = "";
  window.localStorage.setItem("usedSize", 0);
  updateSizes();
}

function removeItem(item){
  const fileItemDiv = item.parentNode.parentNode;
  usedSize -= parseFloat(fileItemDiv.getAttribute("file-size"));
  window.localStorage.setItem("usedSize", usedSize);
  updateSizes();
  uploadedFilesWrapper.removeChild(fileItemDiv);
}

uploadedFilesWrapper.addEventListener("wheel", (evt) => {
  evt.preventDefault();
  uploadedFilesWrapper.scrollLeft += evt.deltaY;
});