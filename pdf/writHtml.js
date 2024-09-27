const HtmlContent = (item, home) => {
  const html = `<!DOCTYPE html>
  <html lang="ar">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
    <!-- border-collapse: collapse; -->
  
  <Style>
    body{
        width: 95%;
        margin: auto;
        margin-top: 35px;
    }
    .page {
      width: 794px;
      /* height: 1123px; */
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      border: 1px dashed #2117fb;
  
    }
    .header {
      display: flex;
      justify-content:space-between;
      align-items: center;
      border: 2px dashed #2117fb;
      border-radius: 15px;
      padding: 10px;
    }
    .header1{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: right;
      margin:10px
      /* border: 2px dashed black */
    }
    .header-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      /* border: 2px dashed black */
    }
    .text-header-right{
      font-family: "Tajawal", system-ui;
      font-size: 17px;
    }
  
    h1{
      font-family: "Tajawal", system-ui;
      font-size: 20px;
  }
  .header-medium{
      justify-content: center;
      align-items: center;
      text-align: center;
  }
    .header-left img {
      width: 100px;
      height: 100px;
      margin-right: 10px;
    }
    .header-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: right;
    }
    .header-right p {
      margin: 0;
      font-size: 14px;
      
    }
    table {
    width: 98%;
    color: #333;
    font-family: Arial, sans-serif;
    font-size: 8px;
    text-align: left;
    padding: 5px;
    border-radius: 5px;
    border: 2px dashed #2117fb;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
  } 
  table th {
  background-color: #447dee;
  color: #fff;
  font-weight: bold;
  font-family:'Tajawal';
  font-size: 13px;
  padding: 3px;
  text-transform: uppercase;
  border: 1px solid  #1b1818;
  letter-spacing: 1px; 
  text-align: center;
  }
  
  table td {
  padding: 3px;
  text-align: center;
  font-family:'Tajawal';
  font-size: 11px;
  border: 1px solid  #1b1818;
  font-weight: bold;
  }
  .footer{
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
  }
  .namedata{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height:70%;
  padding: 5px;
  }
  h4{
    font-family:'Tajawal';
  }
  h5 {
    font-family:'Tajawal';
    margin: auto;
  }
  p{
    margin: 5px;
    font-family:'Tajawal';
  }
  span{
    height: 80%;
    margin: auto;
    margin-left: 10px;
    text-align: center;
  }
  </Style>
  <body>
    <div class="page">
    <div class="header">
      <div class="header1">
        <p class="text-header-right">التاريخ:${new Date().toLocaleDateString()} </p>
      </div>
  
      <div class="header-medium">
          <h1>${home.NameCompany}</h1>
          <h1 style="font-size: 17px;"> فرع :${home.NameBranch}</h1>
          <h1 style="font-size: 17px;"> المشروع: ${home.Nameproject}</h1>
        </div>
      <div class="header-left">
        <img src="https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png" alt="logo"  style="width: 80px;height: 40px;">
        <h1>منصة مشرف</h1>
      </div>
    
    </div>
  
  <table>
     <thead>
          <tr>
      <thead>
              <tbody>
              <!-- <th style="text-align: center;border-color: #333;"  colspan="6">Purchaise</th> -->
                  <tr>
                  
                      <th scope="col" rowspan="2" >الفاتورة </th>
                      <th scope="col" rowspan="3">البيان </th>
                      <th scope="col" rowspan="2">التاريخ </th>
                      <th scope="col" rowspan="2">المبلغ</th>
                      <th scope="col" rowspan="2">التصنيف</th>
                      <!-- rowspan="2" هذه للدمج عمودي -->
                  </tr>
                                                 
              </tbody>
      </thead>
      </tr>         
      <tbody>
  
        ${item.map((pic, index) => {
          return `   
    <tr>
          <td>${pic.items[0].InvoiceNo}</td>
          <td>${pic.items[0].Data}</td>
          <td>${pic.items[0].Date}</td>
          <td>${parseInt(pic.items[0].Amount)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
          <td style="background-color: #447dee; color: #fff;" rowspan=${
            pic.items.filter(
              (i) => i.ClassificationName === pic.ClassificationName
            ).length + 2
          }>${pic.ClassificationName}</td>
        </tr>
          <tr>
        ${pic.items
          .filter(
            (i) =>
              i.InvoiceNo !== pic.items[0].InvoiceNo &&
              i.ClassificationName === pic.ClassificationName
          )
          .map((data, index) => {
            return `      
          <tr>
         <td>${data.InvoiceNo}</td>
          <td>${data.Data}</td>
          <td>${data.Date}</td>
          <td>${parseInt(data.Amount)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
          
        </tr>`;
          })}
            </tr>
        <tr>
                  <td colspan="4">${parseInt(pic.total)
                    .toFixed(2)
                    .replace(
                      /(\d)(?=(\d{3})+(?!\d))/g,
                      "$1,"
                    )} :الاجمالي حسب الصنف</td>
      </tr>
       `;
        })}
  
  <tr>
  
  <td style="background-color: #447dee; color: #fff;" colspan="4">${parseInt(
    item.reduce((acc, current) => acc + current.total, 0)
  )
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
          <td style="background-color: #447dee; color: #fff;">اجمالي المصروفات</td>
        </tr>
      
      
        <!-- Add more rows as needed -->
      </tbody>
    </table>
          </div>
  </body>
  </html>
  `;
  return html;
};

const HtmlStatmentall = (
  dataExpense,
  dataRevenue,
  dataReturned,
  Totalproject,
  dataHome
) => {
  try {
    const html = `<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
  <!-- border-collapse: collapse; -->

<Style>
  body{
      width: 95%;
      margin: auto;
      margin-top: 35px;
  }
  .page {
    width: 794px;
    /* height: 1123px; */
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    border: 1px dashed #2117fb;

  }
  .header {
    display: flex;
    justify-content:space-between;
    align-items: center;
    border: 2px dashed #2117fb;
    border-radius: 15px;
    padding: 10px;
  }
  .header1{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: right;
    margin:10px
    /* border: 2px dashed black */
  }
  .header-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* border: 2px dashed black */
  }
  .text-header-right{
    font-family: "Tajawal", system-ui;
    font-size: 17px;
  }

  h1{
    font-family: "Tajawal", system-ui;
    font-size: 20px;
}
.header-medium{
    justify-content: center;
    align-items: center;
    text-align: center;
}
  .header-left img {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
  .header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }
  .header-right p {
    margin: 0;
    font-size: 14px;
    
  }
  table {
  width: 98%;
  color: #333;
  font-family: Arial, sans-serif;
  font-size: 8px;
  text-align: left;
  padding: 5px;
  border-radius: 5px;
  border: 2px dashed #2117fb;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
} 
table th {
background-color: #447dee;
color: #fff;
font-weight: bold;
font-family:'Tajawal';
font-size: 13px;
padding: 3px;
text-transform: uppercase;
border: 1px solid  #1b1818;
letter-spacing: 1px; 
text-align: center;
}

table td {
padding: 3px;
text-align: center;
font-family:'Tajawal';
font-size: 11px;
border: 1px solid  #1b1818;
font-weight: bold;
}
.footer{
  /* height: 70px; */
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  margin-top: 50px;
}
.footerone{
  font-size: 27px;
  font-family: "Tajawal";
  text-align: center;
}
h4{
  font-family:'Tajawal';
}
h5 {
  font-family:'Tajawal';
  margin: auto;
}
p{
  margin: 5px;
  font-family:'Tajawal';
}
.number{
  background-color: #447dee;
  color:#fff
}
span{
  height: 80%;
  margin: auto;
  margin-left: 10px;
  text-align: center;
}
.header-clint{
  background-color:hsl(220, 83%, 60%);
  margin:10px;
  margin-top: 30px;
  color:#fff;
  height: 33px;
  /* padding: 1px; */
  display: flex;
  justify-content: center;
  align-items: center;
}
</Style>
    <body>
  <div class="page">
  <div class="header">
    <div class="header1">
        <p class="text-header-right">التاريخ:${new Date().toLocaleDateString()} </p>
    </div>

    <div class="header-medium">
         <h1>${dataHome.NameCompany}</h1>
          <h1 style="font-size: 17px;"> فرع :${dataHome.NameBranch}</h1>
          <h1 style="font-size: 17px;"> المشروع: ${dataHome.Nameproject}</h1>
        <h1 style="font-size: 17px;">كشف حساب حسب التصنيف</h1>
      </div>
    <div class="header-left">
      <img src="https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png" alt="logo" style="width: 80px;height: 40px;">
      <h1>منصة مشرف</h1>
    </div>
  
  </div>

<div class="header-clint">
  <h4>عهد العميل</h4>
</div>
<table>
   <thead>
        <tr>
    <thead>
            <tbody>
            <!-- <th style="text-align: center;border-color: #333;"  colspan="6">Purchaise</th> -->
                <tr>
                
                    <th scope="col" rowspan="3">البيان </th>
                    <th scope="col" rowspan="2">تاريخ العهدة </th>
                    <th scope="col" rowspan="2">المبلغ</th>
                    <!-- rowspan="2" هذه للدمج عمودي -->
                </tr>
                                               
            </tbody>
    </thead>
    </tr>         
    <tbody>
    ${dataRevenue.map((item, index) => {
      return `
        <tr>
        <td>${item.Data}</td>
        <td>${item.Date}</td>
        <td>${parseInt(item.Amount)
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
        </tr>
        `;
    })}


<!-- Add more rows as needed -->
    </tbody>
</table>
<div class="header-clint">
<h4>مصروفات العميل</h4>
</div>
<table>
<thead>
<tr>
    <thead>
            <tbody>
            <!-- <th style="text-align: center;border-color: #333;"  colspan="6">Purchaise</th> -->
                <tr>
                
                    <th scope="col" rowspan="2" >الفاتورة </th>
                    <th scope="col" rowspan="3">البيان </th>
                    <th scope="col" rowspan="2">التاريخ </th>
                    <th scope="col" rowspan="2">المبلغ</th>
                    <!-- rowspan="2" هذه للدمج عمودي -->
                </tr>
                                               
            </tbody>
    </thead>
    </tr>         
    <tbody>
      
    ${dataExpense.map((item, index) => {
      return `
        <tr>
        <td>${item.InvoiceNo}</td>
        <td>${item.Data}</td>
        <td>${item.Date}</td>
        <td>${parseInt(item.Amount)
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
        </tr>
        `;
    })}
      <!-- Add more rows as needed -->
    </tbody>
  </table>
  <div class="header-clint">
    <h4>مرتجعات العميل</h4>
  </div>
  <table>
    <thead>
          <tr>
      <thead>
              <tbody>
              <!-- <th style="text-align: center;border-color: #333;"  colspan="6">Purchaise</th> -->
                  <tr>
                  
                      <th scope="col" rowspan="3">البيان </th>
                      <th scope="col" rowspan="2">تاريخ المرتجع </th>
                      <th scope="col" rowspan="2">المبلغ</th>
                      <!-- rowspan="2" هذه للدمج عمودي -->
                  </tr>
              </tbody>
      </thead>
      </tr>         
      <tbody>
    ${dataReturned.map((item, index) => {
      return `
        <tr>
        <td>${item.Data}</td>
        <td>${item.Date}</td>
        <td>${parseInt(item.Amount)
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
        </tr>
        `;
    })}
        <!-- Add more rows as needed -->
      </tbody>
    </table>
<div class="footer">
  <div class="footerone">
    <h6>اجمالي مبلغ العهد</h6>
    <h6 class="number">${parseInt(Totalproject.TotalRevenue)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</h6>
  </div>
  <div class="footerone">
    <h6>اجمالي مبلغ المصروفات</h6>
    <h6 class="number">${parseInt(Totalproject.TotalExpense)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</h6>
  </div>
  <div class="footerone">
    <h6>اجمالي مبلغ المرتجعات</h6>
    <h6 class="number">${parseInt(Totalproject.TotalReturns)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</h6>
  </div>
  </div>
  <div class="footerone">
    <h6>الرصيد المتبقي</h6>
    <h6 class="number">${parseInt(Totalproject.RemainingBalance)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</h6>
  </div>

        </div>
</body>
</html>

    
    `;

    return html;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { HtmlContent, HtmlStatmentall };
