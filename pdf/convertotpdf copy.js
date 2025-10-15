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
    const dataRevenue = await SELECTTablecompanySubProjectREVENUE(idproject,0,'pdf');
    const dataReturned = await SELECTTablecompanySubProjectReturned(idproject,0,'pdf');
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

const browser = await puppeteer.launch({
  headless: true,
  // لو تُشغّل في سيرفر/حاوية أضف التالي لتقليل الأعطال:
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  // executablePath: '/path/to/chrome' // لو كنت تستخدم puppeteer-core بدون Chromium مدمج
});

const page = await browser.newPage();

// ألغِ كل المهلات الافتراضية (يشمل pdf())
page.setDefaultTimeout(0);
page.setDefaultNavigationTimeout(0);

// حمّل الـ HTML
await page.setContent(htmlContent, {
  waitUntil: 'load',   // بدّل domcontentloaded إلى load
  timeout: 0           // لا مهلة
});

// انتظر الصور + الخطوط بشكل مضمون
await page.evaluate(async () => {
  // انتظر الخطوط
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch {}
  }

  // انتظر كل الصور (بما فيها <img> و CSS background عبر decode للـ <img> فقط)
  const imgs = Array.from(document.images || []);
  await Promise.all(imgs.map(img => img.decode?.().catch(() => {}) || 
                                   (img.complete ? Promise.resolve() : new Promise(res => {
                                      img.addEventListener('load', () => res(), {once:true});
                                      img.addEventListener('error', () => res(), {once:true});
                                   }))));

  // (اختياري) انتظر هدوء الشبكة 1 ثانية تقريبًا
  // hack بسيط: انتظر تتابع requestAnimationFrame
  await new Promise(r => setTimeout(r, 1000));
});

// اطبع PDF
await page.emulateMediaType('print'); // أو 'screen' حسب CSS عندك
await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true, // احترم @page إن موجود
  margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
});

await browser.close();


}
// async function convertHtmlToPdf(htmlContent, outputPath) {
//   // Launch a headless browser
//   try {
//     const browser = await puppeteer.launch({
//       defaultViewport: null, // Disable default viewport
//       headless: true, // Run Puppeteer in headless mode
//     });
//     const page = await browser.newPage();
//     // Set the HTML content
//     await page.setContent(htmlContent, {
//       waitUntil: "domcontentloaded",
//       timeout: 6000,
//     });
//     // Wait for the image to load
//     await page.waitForFunction(
//       () => {
//         const images = Array.from(document.querySelectorAll("img"));
//         return images.every((img) => img.complete && img.naturalHeight > 0);
//         // const imgLogo = document.querySelector("img.logo");
//         // const imgLogopm = document.querySelector('img.logopm');

//         // return imgLogo && imgLogo.complete && imgLogo.naturalHeight !== 0;
//         // &&
//         // (imgLogopm && imgLogopm.complete && imgLogopm.naturalHeight !== 0);
//       },
//       { timeout: 3000 }
//     ); // Wait for up to 10 seconds


//     // Generate the PDF
//     await page.pdf({
//       path: outputPath, // Path to save the PDF
//       format: "A4", // Page size
//       printBackground: true, // Include background graphics
//     });

//     // Close the browser
//     await browser.close();

//     // console.log("PDF generated successfully!");
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//   }
// }




module.exports = { convertHtmlToPdf, StatmentExpensePdf, StatmentAllpdf };
