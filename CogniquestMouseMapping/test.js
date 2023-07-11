/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Load and convert the PDF
const pdfUrl = "EE.pdf";
const scale = 1; // Adjust the scale factor as needed

pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
  const numPages = pdf.numPages;
  const renderPromises = [];

  for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
    renderPromises.push(renderPage(pdf, pageNumber));
  }

  return Promise.all(renderPromises);
}).then(function (renderedCanvases) {
  // Adjust the main canvas size based on the rendered canvases
  const mainCanvasWidth = Math.max(...renderedCanvases.map(canvas => canvas.width));
  const mainCanvasHeight = renderedCanvases.reduce((totalHeight, canvas) => totalHeight + canvas.height, 0);
  canvas.width = mainCanvasWidth;
  canvas.height = mainCanvasHeight;

  // Draw each rendered canvas onto the main canvas
  let offsetY = 0;
  renderedCanvases.forEach(renderedCanvas => {
    ctx.drawImage(renderedCanvas, 0, offsetY);
    offsetY += renderedCanvas.height;
  });

  console.log("PDF rendered on the canvas!");

  // Add click event listener to draw lines and log coordinates
  let clickCount = 0;
  canvas.addEventListener("click", function (event) {
    if (clickCount >= 2) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Specify line height
    const lineHeight = 10;

    // Calculate line start and end coordinates
    const lineStartY = Math.max(0, y - lineHeight / 2);
    const lineEndY = Math.min(canvas.height, y + lineHeight / 2);

    // Determine line color based on click count
    const lineColor = clickCount === 0 ? "green" : "red";

    // Draw a vertical line with the specified color
    ctx.strokeStyle = lineColor;
    ctx.beginPath();
    ctx.moveTo(x, lineStartY);
    ctx.lineTo(x, lineEndY);
    ctx.stroke();

    console.log("Clicked at coordinates:", x, y);

    clickCount++;
  });
}).catch(function (error) {
  console.error("Error occurred while rendering the PDF:", error);
});

function renderPage(pdf, pageNumber) {
  return pdf.getPage(pageNumber).then(function (page) {
    const viewport = page.getViewport({ scale: scale });
    const pageWidth = viewport.width;
    const pageHeight = viewport.height;

    const offScreenCanvas = document.createElement("canvas");
    const offScreenCtx = offScreenCanvas.getContext("2d");
    offScreenCanvas.width = pageWidth;
    offScreenCanvas.height = pageHeight;

    const renderContext = {
      canvasContext: offScreenCtx,
      viewport: viewport,
    };

    return page.render(renderContext).promise.then(function () {
      return offScreenCanvas;
    });
  });
}
