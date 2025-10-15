const db = require("./sqlite");

// ALTER TABLE companySubprojects ADD COLUMN numberBuilding INTEGER NULL;
// ALTER TABLE companySubprojects ADD COLUMN Disabled INTEGER NULL DEFAULT 'true';
//  ALTER TABLE company ADD COLUMN DisabledFinance TEXT NULL DEFAULT 'true'
//  ALTER TABLE Requests ADD COLUMN checkorderout TEXT NULL DEFAULT 'false'


// SELECT
//   COUNT(*) AS total,
//   SUM(CASE WHEN lower(COALESCE(Done,'false')) = 'false' THEN 1 ELSE 0 END) AS open_count,
//   SUM(CASE WHEN lower(COALESCE(Done,'false')) = 'true' AND lower(COALESCE(checkorderout,'false')) = 'false'  THEN 1 ELSE 0 END) AS closed_count,
//   SUM(CASE WHEN lower(COALESCE(checkorderout,'false')) = 'true' THEN 1 ELSE 0 END) AS confirmed_count
// FROM Requests;

const CreateTable = () => {
  db.run(`CREATE TABLE IF NOT EXISTS companyRegistration (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        CommercialRegistrationNumber INTEGER NOT NULL,NameCompany TEXT NOT NULL,
        BuildingNumber INTEGER NOT NULL,StreetName TEXT NOT NULL,
        NeighborhoodName TEXT NOT NULL, PostalCode TEXT NOT NULL, City TEXT NOT NULL,Country TEXT NOT NULL,TaxNumber INTEGER NOT NULL,SubscriptionStartDate DATE NULL DEFAULT CURRENT_DATE,Api TEXT NULL DEFAULT 'false',PhoneNumber TEXT NOT NULL,userName TEXT NOT NULL
      )`);
db.run(`CREATE TABLE IF NOT EXISTS company (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        CommercialRegistrationNumber INTEGER NOT NULL,NameCompany TEXT NOT NULL,
        BuildingNumber INTEGER NOT NULL,StreetName TEXT NOT NULL,
        NeighborhoodName TEXT NOT NULL, PostalCode TEXT NOT NULL, City TEXT NOT NULL,Country TEXT NOT NULL,TaxNumber INTEGER NOT NULL,NumberOFbranchesAllowed INTEGER NOT NULL , NumberOFcurrentBranches INTEGER NOT NULL,SubscriptionStartDate DATE NULL DEFAULT CURRENT_DATE,SubscriptionEndDate DATE NULL,Api TEXT NULL,Cost INTEGER NULL DEFAULT 0,DisabledFinance TEXT NULL DEFAULT 'true'
      )`);

  db.run(`CREATE TABLE IF NOT EXISTS companySub (
    id INTEGER PRIMARY KEY AUTOINCREMENT,NumberCompany INTEGER NOT NULL ,NameSub TEXT NOT NULL,BranchAddress TEXT NOT NULL,Email TEXT  NULL,PhoneNumber TEXT  NULL,FOREIGN KEY (NumberCompany) REFERENCES company (id) ON DELETE RESTRICT ON UPDATE RESTRICT 
  )`);

  db.run(
    `CREATE TABLE IF NOT EXISTS Linkevaluation(id INTEGER PRIMARY KEY AUTOINCREMENT, IDcompanySub INTEGER NOT NULL ,urlLink TEXT NULL) `
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS usersCompany(id INTEGER PRIMARY KEY AUTOINCREMENT,IDCompany INTEGER NOT NULL,userName TEXT NOT NULL, IDNumber INTEGER NOT NULL,PhoneNumber TEXT NOT NULL, image TEXT NULL,jobdiscrption NOT NULL ,job TEXT NOT NULL,jobHOM TEXT  NULL, DateOFjoin DATE NULL DEFAULT CURRENT_DATE,Activation NULL DEFAULT 'true',Validity JSON NULL,FOREIGN KEY (IDCompany) REFERENCES company (id) ON DELETE RESTRICT ON UPDATE RESTRICT )`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS usersBransh(id INTEGER PRIMARY KEY AUTOINCREMENT,idBransh INTEGER NOT NULL,user_id INTEGER NOT NULL, job TEXT NULL DEFAULT 'عضو',Acceptingcovenant TEXT NULL DEFAULT 'false',ValidityBransh JSON NULL,DateOFjoin DATE NULL DEFAULT CURRENT_DATE)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS usersProject(id INTEGER PRIMARY KEY AUTOINCREMENT,idBransh INTEGER NOT NULL,ProjectID INTEGER NOT NULL,user_id INTEGER NOT NULL, ValidityProject JSON NULL,DateOFjoin DATE NULL DEFAULT CURRENT_DATE)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS LoginActivaty(id INTEGER PRIMARY KEY AUTOINCREMENT,IDCompany INTEGER NOT NULL,userName TEXT NOT NULL, IDNumber INTEGER NOT NULL,PhoneNumber TEXT NOT NULL, image TEXT NULL , DateOFlogin DATE NULL DEFAULT CURRENT_DATE,DateEndLogin DATE NULL,Activation NULL DEFAULT 'true',job TEXT NOT NULL,jobdiscrption TEXT NOT NULL,Validity JSON NULL,codeVerification INTEGER NOT NULL,token TEXT NULL)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS companySubprojects(id INTEGER PRIMARY KEY AUTOINCREMENT,IDcompanySub INTEGER NOT NULL,Nameproject TEXT NOT NULL, Note TEXT NULL,TypeOFContract TEXT NOT NULL, GuardNumber INTEGER NULL ,LocationProject TEXT NULL , ProjectStartdate DATE NULL ,Imageproject TEXT NULL,Contractsigningdate DATE NULL DEFAULT CURRENT_DATE,numberBuilding INTEGER NULL,Disabled TEXT NULL DEFAULT 'true',Referencenumber INTEGER NULL,FOREIGN KEY (IDcompanySub) REFERENCES companySub (id) ON DELETE RESTRICT ON UPDATE RESTRICT)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS companySubprojectsAudite(id INTEGER PRIMARY KEY AUTOINCREMENT,ProjectID INTEGER NOT NULL,IDcompanySub INTEGER NOT NULL,Nameproject TEXT NOT NULL, Note TEXT NULL,TypeOFContract TEXT NOT NULL, GuardNumber INTEGER NULL ,LocationProject TEXT NULL , ProjectStartdate DATE NULL ,Imageproject TEXT NULL,Contractsigningdate DATE NULL DEFAULT CURRENT_DATE,numberBuilding INTEGER NULL,Disabled TEXT NULL DEFAULT 'true',Referencenumber INTEGER NULL,FOREIGN KEY (IDcompanySub) REFERENCES companySub (id) ON DELETE RESTRICT ON UPDATE RESTRICT)`
  );


  db.run(`
    CREATE TRIGGER IF NOT EXISTS utr_BranchesAuditBranchDetailsss
AFTER INSERT ON companySubprojects
BEGIN
    INSERT INTO companySubprojectsAudite (id, ProjectID, IDcompanySub,Nameproject,Note,TypeOFContract,
    GuardNumber,LocationProject,ProjectStartdate,Imageproject,Contractsigningdate,numberBuilding,Disabled,
    Referencenumber,Project_Space,Cost_per_Square_Meter
    )
    VALUES (NEW.id, NEW.ProjectID, NEW.IDcompanySub,NEW.Nameproject,NEW.Note,NEW.TypeOFContract,
    NEW.GuardNumber,NEW.LocationProject,NEW.ProjectStartdate,NEW.Imageproject,NEW.Contractsigningdate,NEW.numberBuilding,NEW.Disabled,
    NEW.Referencenumber,NEW.Project_Space,NEW.Cost_per_Square_Meter);
END;
    `);

// منصة مشرف من الاعمال الذي قمت بتطويرها لدى شركة شفق الانشائية للمقاولات المعمارية حيث تقوم بادارة المشاريع و انشطة المقاولات والإشراف الفني للمباني وذلك عن طريق الإشراف والمتابعة الالكترونية بين الملاك والمقاولين والمشرفين والمهندسين المسؤولين عن الموقع وتسجيلها وتوثيقها الكترونيا لتسهل على الملاك التواصل مع الأطراف المرتبطة بالمشروع واستدعاء التقارير عند الحاجة



  // templet ****************************************
  db.run(
    `CREATE TABLE IF NOT EXISTS Stagestype(id INTEGER PRIMARY KEY AUTOINCREMENT,IDCompany INTEGER NOT NULL,Type TEXT NULL )`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS StagesTemplet(StageIDtemplet INTEGER PRIMARY KEY AUTOINCREMENT,StageID TEXT NULL,Type nvarchar[50] NULL,StageName nvarchar[max] NOT NULL , Days INTEGER NULL,StartDate TEXT  NULL, EndDate TEXT NULL ,CloseDate TEXT NULL , OrderBy INTEGER NULL )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS StagesSubTemplet(StageSubID INTEGER PRIMARY KEY AUTOINCREMENT,StageID TEXT NULL,StageSubName nvarchar[max] NULL,attached TEXT NULL , CloseDate TEXT NULL)`
  );

  // CUSTOMER TEBLE *************************************
  db.run(
    `CREATE TABLE IF NOT EXISTS StagesCUST(StageCustID INTEGER PRIMARY KEY AUTOINCREMENT,StageID INTEGER  NULL ,ProjectID INTEGER NULL ,Type nvarchar[50]  NULL,StageName TEXT NOT NULL, Days INTEGER NULL,StartDate DATE NOT NULL, EndDate DATE NULL ,CloseDate TEXT NULL , OrderBy INTEGER NULL ,Difference decimal NULL,Done NULL DEFAULT 'false',NoteOpen TEXT NULL,OpenBy nvarchar[50] NULL,NoteClosed TEXT NULL,ClosedBy nvarchar[50] NULL)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS StagesCUST_Image(id INTEGER PRIMARY KEY AUTOINCREMENT,StageID INTEGER  NULL ,ProjectID INTEGER NULL ,url nvarchar[50]  NULL, addedby TEXT NOT NULL , Date DATE NULL DEFAULT CURRENT_DATE)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS StageNotes(StageNoteID INTEGER PRIMARY KEY AUTOINCREMENT,StagHOMID INTEGER  NULL ,ProjectID INTEGER NULL ,Type nvarchar[50] NULL,Note nvarchar[max] NULL, DateNote NULL DEFAULT CURRENT_DATE,
      RecordedBy nvarchar[50] NULL, UpdatedDate NULL DEFAULT CURRENT_DATE,countdayDelay INTEGER NULL ,ImageAttachment TEXT NULL )`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS StagesSub(StageSubID INTEGER PRIMARY KEY AUTOINCREMENT,StagHOMID INTEGER NULL,ProjectID INTEGER NULL ,StageSubName nvarchar[max] NULL,CloseDate TEXT NULL,Done NULL DEFAULT 'false', Note JSON NULL , closingoperations JSON NULL )`
  );

  //  مصروفات
  db.run(
    `CREATE TABLE IF NOT EXISTS Expense(Expenseid INTEGER PRIMARY KEY AUTOINCREMENT, projectID INTEGER NOT NULL, InvoiceNo INTEGER NULL ,Amount DECIMAL NULL, Date DATE NULL DEFAULT CURRENT_DATE , Data nvarchar[max] NULL, ClassificationName TEXT NULL , Image JSON NULL, Taxable nvarchar[10] NULL ,CreatedDate NULL DEFAULT CURRENT_DATE , Referencenumberfinanc INTEGER NULL) `
  );
  // العهد
  db.run(
    `CREATE TABLE IF NOT EXISTS Revenue(RevenueId INTEGER PRIMARY KEY AUTOINCREMENT, projectID INTEGER NOT NULL ,Amount DECIMAL NULL, Date DATE NULL DEFAULT CURRENT_DATE , Data nvarchar[max] NULL, Bank DECIMAL[18,2] NULL,Image JSON NULL ,Referencenumberfinanc INTEGER NULL) `
  );
  //  المرتجع
  db.run(
    `CREATE TABLE IF NOT EXISTS Returns(ReturnsId INTEGER PRIMARY KEY AUTOINCREMENT, projectID INTEGER NOT NULL ,Amount DECIMAL, Date DATE NULL DEFAULT CURRENT_DATE , Data nvarchar[max] NULL,Image JSON NULL,Referencenumberfinanc INTEGER NULL) `
  );
  // حفظ اخر عملية pdf
  db.run(
    `CREATE TABLE IF NOT EXISTS Savepdf(id INTEGER PRIMARY KEY AUTOINCREMENT, projectID INTEGER NOT NULL ,namefileall TEXT NULL,namefileparty TEXT NULL , Date DATE NULL DEFAULT CURRENT_DATE ,Total INTEGER NULL,TotalExpense INTEGER NULL) `
  );
  // الارشيف
  db.run(
    `CREATE TABLE IF NOT EXISTS Archives(ArchivesID INTEGER PRIMARY KEY AUTOINCREMENT,ProjectID INTEGER NOT NULL,FolderName TEXT NOT NULL ,Date DATE NULL DEFAULT CURRENT_DATE ,children JSON NULL,ActivationHome NULL DEFAULT 'true',Activationchildren DEFAULT 'true' )`
  );

  //  الطلبيات
  db.run(
    `CREATE TABLE IF NOT EXISTS Requests(RequestsID INTEGER PRIMARY KEY AUTOINCREMENT,ProjectID INTEGER NOT NULL,Type TEXT NOT NULL, Data nvarchar[max] NOT NULL,Date DATE NULL DEFAULT CURRENT_DATE,Done TEXT NULL DEFAULT 'false',InsertBy navrchar[50] NULL,Implementedby narchar[10] NULL,Image JSON NULL,checkorderout TEXT NULL DEFAULT 'false',DateTime DATE NULL) `
  );

  //العامة منشورات
  db.run(
    `CREATE TABLE IF NOT EXISTS Post (PostID INTEGER PRIMARY KEY AUTOINCREMENT , postBy TEXT NOT NULL, Date DATE NULL DEFAULT CURRENT_DATE, url TEXT NOT NULL , Type TEXT NOT NULL ,Data TEXT NOT NULL,timeminet DATE NULL,  StageID INTEGER NOT NULL, ProjectID INTEGER NOT NULL ,brunshCommpanyID INTEGER NOT NULL , CommpanyID INTEGER NOT NULL)`
  );
  //  التعليقات
  db.run(
    `CREATE TABLE IF NOT EXISTS Comment (CommentID INTEGER PRIMARY KEY AUTOINCREMENT, PostId INTEGER NOT NULL , commentText TEXT NOT NULL, Date DATE DEFAULT CURRENT_DATE,userName TEXT NOT NULL,FOREIGN KEY (PostId) REFERENCES Post (PostID) ON DELETE RESTRICT ON UPDATE RESTRICT)`
  );
  //  الاعجابات
  db.run(
    `CREATE TABLE IF NOT EXISTS Likes (LikesID INTEGER PRIMARY KEY AUTOINCREMENT, PostId INTEGER NOT NULL ,  Date DATE DEFAULT CURRENT_DATE,userName TEXT NOT NULL,FOREIGN KEY (PostId) REFERENCES Post (PostID) ON DELETE RESTRICT ON UPDATE RESTRICT)`
  );
  // دردشة المراحل
  db.run(
    `CREATE TABLE IF NOT EXISTS ChatSTAGE(chatID INTEGER PRIMARY KEY AUTOINCREMENT ,idSendr TEXT NOT NULL, StageID INTEGER NOT NULL ,ProjectID INTEGER NOT NULL,Sender TEXT NOT NULL ,message TEXT NULL,Date DATE DEFAULT CURRENT_DATE,timeminet DATE NULL,File JSON NULL , Reply JSON NULL )`
  );
  //  مشاهدة دردشة المراحل
  db.run(
    `CREATE TABLE IF NOT EXISTS ViewsCHATSTAGE(viewsID INTEGER PRIMARY KEY AUTOINCREMENT, chatID INTEGER NOT NULL, userName TEXT NOT NULL, Date DATE DEFAULT CURRENT_DATE, FOREIGN KEY (chatID) REFERENCES ChatSTAGE (chatID) ON DELETE RESTRICT ON UPDATE RESTRICT) `
  );
  // الدردشة
  db.run(
    `CREATE TABLE IF NOT EXISTS Chat(chatID INTEGER PRIMARY KEY AUTOINCREMENT , idSendr TEXT NOT NULL,Type TEXT NULL ,ProjectID INTEGER NOT NULL,Sender TEXT NOT NULL ,message TEXT NULL,Date DATE DEFAULT CURRENT_DATE,timeminet DATE NULL,File JSON NULL , Reply JSON NULL)`
  );
  //  المشاهدات
  db.run(
    `CREATE TABLE IF NOT EXISTS Views(viewsID INTEGER PRIMARY KEY AUTOINCREMENT, chatID INTEGER NOT NULL, userName TEXT NOT NULL, Date DATE DEFAULT CURRENT_DATE, FOREIGN KEY (chatID) REFERENCES Chat (chatID) ON DELETE RESTRICT ON UPDATE RESTRICT) `
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS Navigation(id INTEGER PRIMARY KEY AUTOINCREMENT,IDCompanySub INTEGER NULL,ProjectID INTEGER NULL, notification JSON NULL, tokens JSON NULL,data JSON NULL, Date DATE DEFAULT CURRENT_DATE,DateDay DATE DEFAULT CURRENT_DATE)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS Projectdataforchat(id INTEGER PRIMARY KEY AUTOINCREMENT,ProjectID INTEGER NULL,Nameproject TEXT NULL,PhoneNumber TEXT NULL ,Disabled TEXT NULL DEFAULT 'false',  Date DATE DEFAULT CURRENT_DATE)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS FinancialCustody (id INTEGER PRIMARY KEY AUTOINCREMENT , idOrder INTEGER NOT NULL ,IDCompany INTEGER NOT NULL, IDCompanySub INTEGER NOT NULL , Requestby TEXT NOT NULL , Amount DECIMAL NOT NULL ,Statement TEXT NOT NULL ,Date DATE DEFAULT CURRENT_TIMESTAMP,Approvingperson TEXT NULL 
    ,ApprovalDate DATE NULL,OrderStatus TEXT NULL DEFAULT 'false',RejectionStatus TEXT NULL DEFAULT 'false', Reasonforrejection TEXT NULL  , Dateofrejection DATE NULL)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS Prepare (id INTEGER PRIMARY KEY AUTOINCREMENT ,IDCompany INTEGER NOT NULL, idUser INTEGER NOT NULL,Dateday DATE DEFAULT CURRENT_DATE ,CheckIntime DATE  NULL, CheckInFile JSON NULL , CheckOUTtime DATE NULL , CheckoutFile JSON NULL , Numberofworkinghours INTEGER NULL,Overtimeassignment TEXT DEFAULT "false" ,Numberofovertimehours INTEGER NULL)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS Flowmove (id INTEGER PRIMARY KEY AUTOINCREMENT ,userName TEXT NOT NULL, PhoneNumber TEXT NOT NULL,Movementtype TEXT NULL,Time DATE DEFAULT CURRENT_DATE)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS UserPrepare (id INTEGER PRIMARY KEY AUTOINCREMENT,idUser INTEGER NOT NULL,IDCompany INTEGER NOT NULL,Time DATE DEFAULT CURRENT_DATE)`
  );
    db.run(`CREATE TABLE IF NOT EXISTS UpdateSystem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT NOT NULL,messageUpdate TEXT NOT NULL
      )`);
  const sql = `CREATE TABLE IF NOT EXISTS BranchdeletionRequests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      IDBranch INTEGER NOT NULL,
      IDCompany INTEGER NOT NULL,
      checkVerification INTEGER NOT NULL,
      PhoneNumber TEXT NOT NULL,
      Date DATE DEFAULT CURRENT_TIMESTAMP
  )`;

  db.run(sql, (err) => {
    if (err) {
      console.error("SQL Error:", err);
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS subscripation (id INTEGER PRIMARY KEY AUTOINCREMENT , IDCompany INTEGER NOT NULL , ProjectID INTEGER NOT NULL ,price DECIMAL  NULL, StartDate DATE NULL,EndDate DATE NULL) `);
  db.run(`CREATE TABLE IF NOT EXISTS Invoice (id INTEGER PRIMARY KEY AUTOINCREMENT , IDCompany INTEGER NOT NULL , Amount DECIMAL NOT NULL ,Subscription_end_date DATE DEFAULT CURRENT_TIMESTAMP,State TEXT NULL )`);
  // console.log((100 / 30) * (30 - 25));



// جديد
 


  // db.run(`
  //   ALTER TABLE StagesCUST
  //   ADD COLUMN Ratio TEXT NULL DEFAULT 0;`)
  // db.run(`
  //   ALTER TABLE StagesCUST
  //   ADD COLUMN attached TEXT NULL;`)
  // db.run(`
  //   ALTER TABLE StagesTemplet
  //   ADD COLUMN attached TEXT NULL;`)
  // db.run(`
  //   ALTER TABLE StagesTemplet
  //   ADD COLUMN IDCompany INTEGER NOT NULL DEFAULT 1;`)
  // db.run(`
  //   ALTER TABLE StagesTemplet
  //   ADD COLUMN Ratio INTEGER NOT NULL DEFAULT 0;`)
  // db.run(`
  //   ALTER TABLE StagesSubTemplet
  //   ADD COLUMN IDCompany INTEGER NOT NULL DEFAULT 1;`)
  // db.run(`
  //   ALTER TABLE StagesTemplet
  //   ADD COLUMN Stagestype_id INTEGER  NULL ;`)
  // db.run(`
  //   ALTER TABLE StagesSubTemplet
  //   ADD COLUMN Stagestype_id INTEGER  NULL ;`)

  // db.run(`
  //   ALTER TABLE company
  //   ADD COLUMN State TEXT NULL DEFAULT 'true';`)
  // db.run(`
  //   ALTER TABLE company
  //   ADD COLUMN Suptype TEXT NULL DEFAULT 'مجاني';`)

//  db.run( `ALTER TABLE company ADD COLUMN usertype TEXT NULL DEFAULT 'شركات'`);
//  db.run(`
//     ALTER TABLE  StagesSub
//     ADD COLUMN attached TEXT NULL `)
// db.run(`
//   ALTER TABLE subscripation
//   ADD COLUMN price DECIMAL;`)

  // db.run(`
  //   ALTER TABLE StagesCUST
  //   ADD COLUMN Referencenumber INTEGER NULL;`)
  // db.run(`
  //   ALTER TABLE Expense
  //   ADD COLUMN Amount2 DECIMAL(18,2) NULL;`)
  // db.run(`
  //   ALTER TABLE Expense
  //   ADD COLUMN Referencenumberfinanc INTEGER NULL;`)
  // db.run(`
  //   ALTER TABLE Revenue
  //   ADD COLUMN Referencenumberfinanc INTEGER NULL;`)
  // db.run(`
  //   ALTER TABLE Revenue
  //   ADD COLUMN Referencenumberfinanc INTEGER NULL;`)
  // db.run(`
  //   ALTER TABLE Returns
  //   ADD COLUMN Referencenumberfinanc INTEGER NULL;`)

  //
  // db.run(`
  //   ALTER TABLE companySubprojects
  //   ADD COLUMN Project_Space INTEGER NULL DEFAULT 0`);
  // db.run(`
  //   ALTER TABLE companySubprojects
  //   ADD COLUMN Cost_per_Square_Meter DECIMAL NULL DEFAULT 0`);
  // db.run(`
  //   ALTER TABLE companySubprojectsAudite
  //   ADD COLUMN Project_Space INTEGER NULL DEFAULT 0`);
  // db.run(`
  //   ALTER TABLE companySubprojectsAudite
  //   ADD COLUMN Cost_per_Square_Meter DECIMAL NULL DEFAULT 0`);



  // db.run(`
  //   ALTER TABLE companySubprojects
  //   ADD COLUMN cost INTEGER NULL `)
  // db.run(`
  //   ALTER TABLE companySubprojects
  //   ADD COLUMN rate INTEGER NULL `)
  // db.run(`
  //   ALTER TABLE companySubprojects
  //   ADD COLUMN countuser INTEGER NULL  `)
  // db.run(`
  //   ALTER TABLE StagesCUST
  //   ADD COLUMN rate DATE NULL ;`  )

  // db.run(`
  //   ALTER TABLE Requests
  //   ADD COLUMN DateTime DATE NULL ;`  )
};

// const createtabletTemplet =()=>{
//   dbd.run(
//     `CREATE TABLE IF NOT EXISTS StagesTemplet(StageID INTEGER PRIMARY KEY AUTOINCREMENT,Type nvarchar[50] NULL,StageName nvarchar[max] NOT NULL , Days INTEGER NULL,StartDate TEXT  NULL, EndDate TEXT NULL ,CloseDate TEXT NULL , OrderBy INTEGER NULL
//   )`
//   );

//   dbd.run(
//     `CREATE TABLE IF NOT EXISTS StagesSubTemplet(StageSubID INTEGER PRIMARY KEY AUTOINCREMENT,StageID INTEGER NULL,ProjectID INTEGER NULL ,StageSubName nvarchar[max] NULL,ImageAttachment TEXT NULL , CloseDate TEXT NULL)`
//   );
// }

module.exports = { CreateTable };

// `DECLARE @DAYS nvarchar(50)
// DECLARE @DAYSOFStage int

// set @DAYSOFStage =(select sum(Days) from [StagesCUST] where ProjectID = 2)
// set @DAYS= (select ProjectStartdate from [companySubprojects] where id = 2)
// IF @DAYS is null
//     SELECT @DAYSOFStage as 'الناتج';
// ELSE
// SELECT DATEDIFF(day, getdate(),DATEADD(day, @DAYSOFStage, ProjectStartdate)) as 'الناتج' from [companySubprojects]  where  id= 2`
