CREATE DATABASE cattlecare_pro;
show databases;
use cattlecare_pro;
SET FOREIGN_KEY_CHECKS = 0;
CREATE TABLE USER (
    UserID INT NOT NULL AUTO_INCREMENT,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Password  VARCHAR(255) NOT NULL, 
    Role ENUM('Admin','Manager','Vet','Viewer') NOT NULL DEFAULT 'Viewer',
    Phone VARCHAR(20),
    CONSTRAINT pk_user PRIMARY KEY (UserID)
);
show tables;

CREATE TABLE FARM (
    FarmID INT NOT NULL AUTO_INCREMENT,
    FarmName VARCHAR(150) NOT NULL,
    Location VARCHAR(255),
    TotalArea DECIMAL(10,2),    
    OwnerID INT NOT NULL,
    CONSTRAINT pk_farm  PRIMARY KEY (FarmID),
    CONSTRAINT fk_farm_user FOREIGN KEY (OwnerID)
        REFERENCES USER(UserID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE CATTLE (
    CattleID INT NOT NULL AUTO_INCREMENT,
    TagNumber VARCHAR(50) NOT NULL UNIQUE,
    Name  VARCHAR(100),
    Breed  VARCHAR(100),
    Gender ENUM('Male','Female') NOT NULL,
    DateOfBirth DATE,
    Status ENUM('Active','Sold','Dead') NOT NULL DEFAULT 'Active',
    FarmID INT NOT NULL,
    CONSTRAINT pk_cattle PRIMARY KEY (CattleID),
    CONSTRAINT fk_cattle_farm FOREIGN KEY (FarmID)
        REFERENCES FARM(FarmID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE COW (
    CattleID INT NOT NULL,
    MilkProduction DECIMAL(6,2),              
    LactationStatus ENUM('Lactating','Dry','Pregnant') NOT NULL DEFAULT 'Dry',
    LastCalvingDate DATE,
    CONSTRAINT pk_cow PRIMARY KEY (CattleID),
    CONSTRAINT fk_cow_cattle FOREIGN KEY (CattleID)
        REFERENCES CATTLE(CattleID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE BULL (
    CattleID INT NOT NULL,
    FertilityStatus ENUM('Fertile','Infertile','Unknown') NOT NULL DEFAULT 'Unknown',
    SemenQuality ENUM('Excellent','Good','Poor','Unknown') NOT NULL DEFAULT 'Unknown',
    CONSTRAINT pk_bull PRIMARY KEY (CattleID),
    CONSTRAINT fk_bull_cattle FOREIGN KEY (CattleID)
        REFERENCES CATTLE(CattleID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE WEIGHT_RECORD (
    WeightID INT NOT NULL AUTO_INCREMENT,
    CattleID INT NOT NULL,
    WeightDate DATE NOT NULL,
    WeightKg DECIMAL(6,2) NOT NULL,
    CONSTRAINT pk_weight PRIMARY KEY (WeightID),
    CONSTRAINT fk_weight_cattle FOREIGN KEY (CattleID)
        REFERENCES CATTLE(CattleID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE COLOR_RECORD (
    ColorID  INT NOT NULL AUTO_INCREMENT,
    CattleID INT NOT NULL,
    PrimaryColor VARCHAR(50) NOT NULL,
    SecondaryColor VARCHAR(50),
    Pattern VARCHAR(100),
    RecordedDate DATE NOT NULL,
    CONSTRAINT pk_color PRIMARY KEY (ColorID),
    CONSTRAINT fk_color_cattle FOREIGN KEY (CattleID)
        REFERENCES CATTLE(CattleID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE DEATH_RECORD (
    DeathID INT NOT NULL AUTO_INCREMENT,
    CattleID INT NOT NULL UNIQUE,  
    DeathDate DATE NOT NULL,
    Cause VARCHAR(255),
    VetVerified TINYINT(1)  NOT NULL DEFAULT 0,
    CONSTRAINT pk_death PRIMARY KEY (DeathID),
    CONSTRAINT fk_death_cattle FOREIGN KEY (CattleID)
        REFERENCES CATTLE(CattleID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE BREEDING_RECORD (
    BreedingID INT NOT NULL AUTO_INCREMENT,
    CowID INT NOT NULL,
    BullID INT NOT NULL,
    BreedingDate DATE NOT NULL,
    Method ENUM('Natural','AI') NOT NULL DEFAULT 'Natural',
    ExpectedDueDate DATE,
    Outcome ENUM('Pending','Successful','Failed') NOT NULL DEFAULT 'Pending',
    CONSTRAINT pk_breeding PRIMARY KEY (BreedingID),
    CONSTRAINT fk_breeding_cow FOREIGN KEY (CowID)
        REFERENCES COW(CattleID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_breeding_bull     FOREIGN KEY (BullID)
        REFERENCES BULL(CattleID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

show tables;

CREATE TABLE BIRTH_RECORD (
    BirthID INT NOT NULL AUTO_INCREMENT,
    MotherID INT NOT NULL,
    CalfID INT NOT NULL UNIQUE,
    BreedingID INT, 
    BirthDate DATE NOT NULL,
    BirthWeight DECIMAL(5,2),
    Complications TEXT,
    CONSTRAINT pk_birth PRIMARY KEY (BirthID),
    CONSTRAINT fk_birth_mother FOREIGN KEY (MotherID)
        REFERENCES COW(CattleID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_birth_calf        FOREIGN KEY (CalfID)
        REFERENCES CATTLE(CattleID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_birth_breeding    FOREIGN KEY (BreedingID)
        REFERENCES BREEDING_RECORD(BreedingID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


CREATE TABLE PURCHASE_RECORD (
    PurchaseID INT NOT NULL AUTO_INCREMENT,
    CattleID INT NOT NULL,
    UserID INT NOT NULL, 
    SellerName VARCHAR(150),
    PurchaseDate DATE NOT NULL,
    PurchasePrice DECIMAL(12,2) NOT NULL,
    MarketName VARCHAR(150),
    CONSTRAINT pk_purchase PRIMARY KEY (PurchaseID),
    CONSTRAINT fk_purchase_cattle FOREIGN KEY (CattleID)
        REFERENCES CATTLE(CattleID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_purchase_user FOREIGN KEY (UserID)
        REFERENCES USER(UserID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE SALE_RECORD (
    SaleID INT NOT NULL AUTO_INCREMENT,
    CattleID INT NOT NULL,
    UserID INT NOT NULL, 
    BuyerName VARCHAR(150),
    SaleDate DATE NOT NULL,
    SalePrice DECIMAL(12,2) NOT NULL,
    MarketName VARCHAR(150),
    CONSTRAINT pk_sale PRIMARY KEY (SaleID),
    CONSTRAINT fk_sale_cattle FOREIGN KEY (CattleID)
        REFERENCES CATTLE(CattleID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_sale_user FOREIGN KEY (UserID)
        REFERENCES USER(UserID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


CREATE TABLE PROFIT_LOSS_RECORD (
    RecordID  INT NOT NULL AUTO_INCREMENT,
    CattleID INT NOT NULL,
    PurchaseID  INT,
    SaleID INT,
    ProfitLoss DECIMAL(12,2) NOT NULL,
    CalculationDate DATE NOT NULL,
    CONSTRAINT pk_profitloss PRIMARY KEY (RecordID),
    CONSTRAINT fk_pl_cattle FOREIGN KEY (CattleID)
        REFERENCES CATTLE(CattleID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_pl_purchase FOREIGN KEY (PurchaseID)
        REFERENCES PURCHASE_RECORD(PurchaseID)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_pl_sale FOREIGN KEY (SaleID)
        REFERENCES SALE_RECORD(SaleID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);




CREATE INDEX idx_cattle_farm        ON CATTLE(FarmID);
CREATE INDEX idx_cattle_status      ON CATTLE(Status);
CREATE INDEX idx_cattle_gender      ON CATTLE(Gender);
CREATE INDEX idx_weight_cattle      ON WEIGHT_RECORD(CattleID);
CREATE INDEX idx_weight_date        ON WEIGHT_RECORD(WeightDate);
CREATE INDEX idx_breeding_cow       ON BREEDING_RECORD(CowID);
CREATE INDEX idx_breeding_date      ON BREEDING_RECORD(BreedingDate);
CREATE INDEX idx_birth_mother       ON BIRTH_RECORD(MotherID);
CREATE INDEX idx_purchase_date      ON PURCHASE_RECORD(PurchaseDate);
CREATE INDEX idx_sale_date          ON SALE_RECORD(SaleDate);





CREATE OR REPLACE VIEW vw_ActiveCattle AS
SELECT
    c.CattleID,
    c.TagNumber,
    c.Name,
    c.Breed,
    c.Gender,
    c.DateOfBirth,
    c.Status,
    f.FarmName
FROM CATTLE c
JOIN FARM f ON c.FarmID = f.FarmID
WHERE c.Status = 'Active';


CREATE OR REPLACE VIEW vw_CowMilkOverview AS
SELECT
    c.CattleID,
    c.TagNumber,
    c.Name,
    co.MilkProduction,
    co.LactationStatus,
    co.LastCalvingDate
FROM CATTLE c
JOIN COW co ON c.CattleID = co.CattleID
WHERE c.Status = 'Active';


CREATE OR REPLACE VIEW vw_ProfitLossSummary AS
SELECT
    pl.RecordID,
    c.TagNumber,
    c.Name AS CattleName,
    pr.PurchasePrice,
    sr.SalePrice,
    pl.ProfitLoss,
    pl.CalculationDate
FROM PROFIT_LOSS_RECORD pl
JOIN CATTLE c ON pl.CattleID = c.CattleID
LEFT JOIN PURCHASE_RECORD pr ON pl.PurchaseID = pr.PurchaseID
LEFT JOIN SALE_RECORD sr ON pl.SaleID = sr.SaleID;



DELIMITER $$

CREATE TRIGGER trg_after_death_insert
AFTER INSERT ON DEATH_RECORD
FOR EACH ROW
BEGIN
    UPDATE CATTLE
    SET Status = 'Dead'
    WHERE CattleID = NEW.CattleID;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_after_sale_insert
AFTER INSERT ON SALE_RECORD
FOR EACH ROW
BEGIN
    UPDATE CATTLE
    SET Status = 'Sold'
    WHERE CattleID = NEW.CattleID;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_auto_profitloss_on_sale
AFTER INSERT ON SALE_RECORD
FOR EACH ROW
BEGIN
    DECLARE v_purchaseID    INT DEFAULT NULL;
    DECLARE v_purchasePrice DECIMAL(12,2) DEFAULT 0;
 
    SELECT PurchaseID, PurchasePrice
    INTO   v_purchaseID, v_purchasePrice
    FROM   PURCHASE_RECORD
    WHERE  CattleID = NEW.CattleID
    ORDER BY PurchaseDate DESC
    LIMIT 1;
 
    INSERT INTO PROFIT_LOSS_RECORD
        (CattleID, PurchaseID, SaleID, ProfitLoss, CalculationDate)
    VALUES
        (NEW.CattleID,
         v_purchaseID,
         NEW.SaleID,
         NEW.SalePrice - v_purchasePrice,
         CURDATE());
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_check_gender_cow
BEFORE INSERT ON COW
FOR EACH ROW
BEGIN
    DECLARE v_gender VARCHAR(10);
    SELECT Gender INTO v_gender FROM CATTLE WHERE CattleID = NEW.CattleID;
    IF v_gender <> 'Female' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot add COW record: cattle gender is not Female';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_check_gender_bull
BEFORE INSERT ON BULL
FOR EACH ROW
BEGIN
    DECLARE v_gender VARCHAR(10);
    SELECT Gender INTO v_gender FROM CATTLE WHERE CattleID = NEW.CattleID;
    IF v_gender <> 'Male' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot add BULL record: cattle gender is not Male';
    END IF;
END$$
DELIMITER ;




DELIMITER $$
CREATE PROCEDURE sp_AddCattle(
    IN p_TagNumber VARCHAR(50),
    IN p_Name VARCHAR(100),
    IN p_Breed VARCHAR(100),
    IN p_Gender ENUM('Male','Female'),
    IN p_DateOfBirth DATE,
    IN p_FarmID INT,
    OUT p_NewCattleID INT
)
BEGIN
    INSERT INTO CATTLE (TagNumber, Name, Breed, Gender, DateOfBirth, Status, FarmID)
    VALUES (p_TagNumber, p_Name, p_Breed, p_Gender, p_DateOfBirth, 'Active', p_FarmID);
    SET p_NewCattleID = LAST_INSERT_ID();
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE sp_AddCow(
    IN p_CattleID INT,
    IN p_MilkProd DECIMAL(6,2),
    IN p_LactStatus ENUM('Lactating','Dry','Pregnant'),
    IN p_LastCalving DATE
)
BEGIN
    INSERT INTO COW (CattleID, MilkProduction, LactationStatus, LastCalvingDate)
    VALUES (p_CattleID, p_MilkProd, p_LactStatus, p_LastCalving);
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE sp_AddBull(
    IN p_CattleID INT,
    IN p_FertilityStatus ENUM('Fertile','Infertile','Unknown'),
    IN p_SemenQuality ENUM('Excellent','Good','Poor','Unknown')
)
BEGIN
    INSERT INTO BULL (CattleID, FertilityStatus, SemenQuality)
    VALUES (p_CattleID, p_FertilityStatus, p_SemenQuality);
END$$
DELIMITER ;



DELIMITER $$
CREATE PROCEDURE sp_RecordBreeding(
    IN p_CowID INT,
    IN p_BullID INT,
    IN p_BreedingDate DATE,
    IN p_Method ENUM('Natural','AI'),
    IN p_ExpectedDue DATE
)
BEGIN
    INSERT INTO BREEDING_RECORD (CowID, BullID, BreedingDate, Method, ExpectedDueDate, Outcome)
    VALUES (p_CowID, p_BullID, p_BreedingDate, p_Method, p_ExpectedDue, 'Pending');
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE sp_RecordBirth(
    IN p_MotherID INT,
    IN p_CalfID INT,
    IN p_BreedingID INT,
    IN p_BirthDate DATE,
    IN p_BirthWeight DECIMAL(5,2),
    IN p_Complications TEXT
)
BEGIN
    INSERT INTO BIRTH_RECORD (MotherID, CalfID, BreedingID, BirthDate, BirthWeight, Complications)
    VALUES (p_MotherID, p_CalfID, p_BreedingID, p_BirthDate, p_BirthWeight, p_Complications);
 
    UPDATE COW SET LastCalvingDate = p_BirthDate WHERE CattleID = p_MotherID;
 
    IF p_BreedingID IS NOT NULL THEN
        UPDATE BREEDING_RECORD SET Outcome = 'Successful' WHERE BreedingID = p_BreedingID;
    END IF;
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE sp_RecordPurchase(
    IN p_CattleID INT,
    IN p_UserID INT,
    IN p_SellerName  VARCHAR(150),
    IN p_PurchaseDate DATE,
    IN p_Price DECIMAL(12,2),
    IN p_MarketName VARCHAR(150)
)
BEGIN
    INSERT INTO PURCHASE_RECORD (CattleID, UserID, SellerName, PurchaseDate, PurchasePrice, MarketName)
    VALUES (p_CattleID, p_UserID, p_SellerName, p_PurchaseDate, p_Price, p_MarketName);
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE sp_RecordSale(
    IN p_CattleID INT,
    IN p_UserID INT,
    IN p_BuyerName VARCHAR(150),
    IN p_SaleDate DATE,
    IN p_Price DECIMAL(12,2),
    IN p_MarketName VARCHAR(150)
)
BEGIN
    INSERT INTO SALE_RECORD (CattleID, UserID, BuyerName, SaleDate, SalePrice, MarketName)
    VALUES (p_CattleID, p_UserID, p_BuyerName, p_SaleDate, p_Price, p_MarketName);
    END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE sp_RecordDeath(
    IN p_CattleID INT,
    IN p_DeathDate DATE,
    IN p_Cause VARCHAR(255),
    IN p_VetVerified TINYINT(1)
)
BEGIN
    INSERT INTO DEATH_RECORD (CattleID, DeathDate, Cause, VetVerified)
    VALUES (p_CattleID, p_DeathDate, p_Cause, p_VetVerified);
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE sp_AddWeightRecord(
    IN p_CattleID INT,
    IN p_Date DATE,
    IN p_WeightKg DECIMAL(6,2)
)
BEGIN
    INSERT INTO WEIGHT_RECORD (CattleID, WeightDate, WeightKg)
    VALUES (p_CattleID, p_Date, p_WeightKg);
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE sp_GetCattleProfile(
    IN p_CattleID INT
)
BEGIN
    SELECT c.*, f.FarmName
    FROM   CATTLE c
    JOIN   FARM f ON c.FarmID = f.FarmID
    WHERE  c.CattleID = p_CattleID;

    SELECT WeightDate, WeightKg
    FROM   WEIGHT_RECORD
    WHERE  CattleID = p_CattleID
    ORDER BY WeightDate DESC;
 
    SELECT PrimaryColor, SecondaryColor, Pattern, RecordedDate
    FROM   COLOR_RECORD
    WHERE  CattleID = p_CattleID
    ORDER BY RecordedDate DESC;
END$$
DELIMITER ;

SET FOREIGN_KEY_CHECKS = 1;

use cattlecare_pro;
select * from cattle;
delete from bull where CattleID=17;
DESCRIBE cattle;

