const puppeteer = require("puppeteer");
const {
  SELECTdataprojectandbrinshandcompany,
  SELECTTablecompanySubProjectexpense,
  SELECTTablecompanySubProjectREVENUE,
  SELECTTablecompanySubProjectReturned,
  SELECTSUMAmountandBring,
} = require("../sql/selected/selected");
const { HtmlContent, HtmlStatmentall } = require("./writHtml");

//  كشف حساب كامل للمصروفات
const StatmentExpensePdf = async (idproject, namefile) => {
  const dataHome = await SELECTdataprojectandbrinshandcompany(idproject);
  const dataSub = await SELECTTablecompanySubProjectexpense(idproject,'pdf');
  const dates = dataSub.map((item) => item.ClassificationName);

  const uniqueDates = [...new Set(dates)];

  const matrix = uniqueDates.map((date) => {
    const filteredItems = dataSub.filter(
      (item) => item.ClassificationName === date
    );
    return {
      ClassificationName: date,
      total: filteredItems.reduce((acc, current) => acc + current.Amount, 0),
      items: filteredItems,
    };
  });
  const htmlContent = await HtmlContent(matrix, dataHome);

  await convertHtmlToPdf(htmlContent, namefile);
};

//  كشف حسب التصنيف

const StatmentAllpdf = async (idproject, namefile) => {
  try {
    const dataHome = await SELECTdataprojectandbrinshandcompany(idproject);
    const dataExpense = await SELECTTablecompanySubProjectexpense(idproject,'pdf');
    const dataRevenue = await SELECTTablecompanySubProjectREVENUE(idproject,'pdf');
    const dataReturned = await SELECTTablecompanySubProjectReturned(idproject,'pdf');
    const Totalproject = await SELECTSUMAmountandBring(idproject);

    const htmlContent = await HtmlStatmentall(
      dataExpense,
      dataRevenue,
      dataReturned,
      Totalproject,
      dataHome
    );
    await convertHtmlToPdf(htmlContent, namefile);
  } catch (error) {
    console.log(error);
  }
};

async function convertHtmlToPdf(htmlContent, outputPath) {
  // Launch a headless browser
  try {
    const browser = await puppeteer.launch({
      defaultViewport: null, // Disable default viewport
      headless: true, // Run Puppeteer in headless mode
    });
    const page = await browser.newPage();
    // Set the HTML content
    await page.setContent(htmlContent, {
      waitUntil: "domcontentloaded",
      timeout: 6000,
    });
    // Wait for the image to load
    await page.waitForFunction(
      () => {
        const images = Array.from(document.querySelectorAll("img"));
        return images.every((img) => img.complete && img.naturalHeight > 0);
        // const imgLogo = document.querySelector("img.logo");
        // const imgLogopm = document.querySelector('img.logopm');

        // return imgLogo && imgLogo.complete && imgLogo.naturalHeight !== 0;
        // &&
        // (imgLogopm && imgLogopm.complete && imgLogopm.naturalHeight !== 0);
      },
      { timeout: 2000 }
    ); // Wait for up to 10 seconds


    // Generate the PDF
    await page.pdf({
      path: outputPath, // Path to save the PDF
      format: "A4", // Page size
      printBackground: true, // Include background graphics
    });

    // Close the browser
    await browser.close();

    console.log("PDF generated successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

module.exports = { convertHtmlToPdf, StatmentExpensePdf, StatmentAllpdf };
