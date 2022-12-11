const sizeUnitElements = document.getElementsByClassName("size-unit");
const uploadedFilesWrapper = document.getElementById("uploaded-files-wrapper");

for (var i = 0; i < sizeUnitElements.length; i++) {
  sizeUnitElements[i].innerHTML = "MB";
}
const totalSize = 100;

let usedSize;
try {
  usedSize = parseFloat(Number(window.localStorage.getItem("usedSize")).toFixed(2));
} catch (error) {
  usedSize = 0;
  window.localStorage.setItem("usedSize", 0);
}


function onFileInputChange(event) {
  let fileName = event.value.split("\\");
  fileName = fileName[fileName.length - 1];

  const isImgFile = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileName);
  if (!isImgFile) {
    alert("Invalid file type!");
  } else {
    let fileSize = parseFloat(parseFloat(event.files[0].size / 1024 / 1024).toFixed(2));
    if (usedSize + fileSize > totalSize) {
      alert("Not enough size!");
    } else {
      usedSize += fileSize;
      window.localStorage.setItem("usedSize", usedSize);
      updateSizes();
      uploadedFilesWrapper.innerHTML +=
        '<div class="uploaded-file__item" file-size="' +
        fileSize +
        '"><p class="uploaded-file__item-text"><span>' +
        fileName +
        '</span><i class="fa-solid fa-xmark" onclick="removeItem(this)"></i></p></div>';
    }
  }
  event.value = "";
}

updateSizes();

function updateSizes() {
  const usedSizeElement = document.getElementById("used-size");
  const remainSizeElement = document.getElementById("remain-size");
  const progressBarClr = document.getElementById("progress-bar-clr");
  const progressBarCircle = document.getElementById("progress-bar-circle");
  const maxSizeElement = document.getElementById("max-size");
  

  // usedSize = parseFloat(Number(window.localStorage.getItem("usedSize")).toFixed(2));
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
  usedSize = 0;
  window.localStorage.setItem("usedSize", 0);
  updateSizes();
}

function removeItem(item) {
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
