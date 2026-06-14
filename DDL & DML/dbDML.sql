USE cattlecare_pro;
SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO USER (FullName, Email, Password, Role, Phone) VALUES
('Ahmad Raza',        'ahmad.raza@cattlecare.pk',    'hashed_pass_01', 'Admin',   '0300-1234567'),
('Bilal Hassan',      'bilal.hassan@cattlecare.pk',  'hashed_pass_02', 'Manager', '0301-2345678'),
('Sana Malik',        'sana.malik@cattlecare.pk',    'hashed_pass_03', 'Vet',     '0302-3456789'),
('Usman Tariq',       'usman.tariq@cattlecare.pk',   'hashed_pass_04', 'Viewer',  '0303-4567890'),
('Fatima Noor',       'fatima.noor@cattlecare.pk',   'hashed_pass_05', 'Manager', '0304-5678901'),
('Zubair Ahmed',      'zubair.ahmed@cattlecare.pk',  'hashed_pass_06', 'Vet',     '0305-6789012'),
('Hina Iqbal',        'hina.iqbal@cattlecare.pk',    'hashed_pass_07', 'Viewer',  '0306-7890123'),
('Kamran Sheikh',     'kamran.sheikh@cattlecare.pk', 'hashed_pass_08', 'Admin',   '0307-8901234'),
('Nadia Farooq',      'nadia.farooq@cattlecare.pk',  'hashed_pass_09', 'Viewer',  '0308-9012345'),
('Tariq Mehmood',     'tariq.mehmood@cattlecare.pk', 'hashed_pass_10', 'Manager', '0309-0123456'),
('Ayesha Siddiqui',   'ayesha.s@cattlecare.pk',      'hashed_pass_11', 'Vet',     '0310-1234567'),
('Imran Butt',        'imran.butt@cattlecare.pk',    'hashed_pass_12', 'Viewer',  '0311-2345678'),
('Rabia Chaudhry',    'rabia.c@cattlecare.pk',       'hashed_pass_13', 'Viewer',  '0312-3456789'),
('Asif Nawaz',        'asif.nawaz@cattlecare.pk',    'hashed_pass_14', 'Manager', '0313-4567890'),
('Saima Jabeen',      'saima.jabeen@cattlecare.pk',  'hashed_pass_15', 'Viewer',  '0314-5678901');



INSERT INTO FARM (FarmName, Location, TotalArea, OwnerID) VALUES
('Green Valley Farm', 'Mianwali, Punjab, Pakistan', 120.50, 1);



INSERT INTO CATTLE (TagNumber, Name, Breed, Gender, DateOfBirth, Status, FarmID) VALUES
('GVF-001', 'Roshni',   'Sahiwal',       'Female', '2019-03-15', 'Active', 1),
('GVF-002', 'Champa',   'Nili-Ravi',     'Female', '2018-07-22', 'Active', 1),
('GVF-003', 'Gulabo',   'Sahiwal',       'Female', '2020-01-10', 'Active', 1),
('GVF-004', 'Motia',    'Cholistani',    'Female', '2019-11-05', 'Active', 1),
('GVF-005', 'Laila',    'Nili-Ravi',     'Female', '2017-05-18', 'Active', 1),
('GVF-006', 'Heer',     'Sahiwal',       'Female', '2021-02-28', 'Active', 1),
('GVF-007', 'Nargis',   'Cholistani',    'Female', '2020-08-14', 'Active', 1),
('GVF-008', 'Sona',     'Nili-Ravi',     'Female', '2018-12-01', 'Active', 1),
('GVF-009', 'Sultan',   'Sahiwal',       'Male',   '2017-04-10', 'Active', 1),
('GVF-010', 'Bahadur',  'Nili-Ravi',     'Male',   '2018-09-25', 'Active', 1),
('GVF-011', 'Shehzada', 'Cholistani',    'Male',   '2019-06-07', 'Active', 1),
('GVF-012', 'Moti',     'Sahiwal',       'Male',   '2023-04-02', 'Active', 1),
('GVF-013', 'Rani',     'Nili-Ravi',     'Female', '2023-07-18', 'Active', 1),
('GVF-014', 'Chand',    'Sahiwal',       'Female', '2022-11-30', 'Active', 1),
('GVF-015', 'Jharna',   'Nili-Ravi',     'Female', '2016-03-20', 'Sold',   1),
('GVF-016', 'Toofan',   'Sahiwal',       'Male',   '2016-08-11', 'Sold',   1),
('GVF-017', 'Badal',    'Cholistani',    'Male',   '2015-05-14', 'Dead',   1),
('GVF-018', 'Zara',     'Sahiwal',       'Female', '2021-09-09', 'Active', 1),
('GVF-019', 'Neeli',    'Nili-Ravi',     'Female', '2022-01-17', 'Active', 1),
('GVF-020', 'Rustam',   'Cholistani',    'Male',   '2020-03-22', 'Active', 1);


INSERT INTO COW (CattleID, MilkProduction, LactationStatus, LastCalvingDate) VALUES
(1,  12.50, 'Lactating', '2023-04-02'),   
(2,  15.00, 'Lactating', '2023-07-18'),   
(3,   8.00, 'Dry',       NULL),         
(4,  10.00, 'Pregnant',  '2022-06-15'),   
(5,  14.50, 'Lactating', '2023-01-10'),  
(6,   0.00, 'Dry',       NULL),         
(7,   9.50, 'Pregnant',  '2022-09-20'),   
(8,  13.00, 'Lactating', '2023-03-05'),  
(13,  0.00, 'Dry',       NULL),           
(14,  0.00, 'Dry',       NULL),           
(15, 11.00, 'Dry',       '2022-05-10'),   
(18,  7.50, 'Dry',       NULL),          
(19,  6.00, 'Dry',       NULL);  



INSERT INTO BULL (CattleID, FertilityStatus, SemenQuality) VALUES
(9,  'Fertile',   'Excellent'),  
(10, 'Fertile',   'Good'),       
(11, 'Fertile',   'Good'),        
(12, 'Unknown',   'Unknown'),     
(16, 'Fertile',   'Good'),        
(17, 'Infertile', 'Poor'),        
(20, 'Fertile',   'Excellent');    



INSERT INTO WEIGHT_RECORD (CattleID, WeightDate, WeightKg) VALUES
(1,  '2023-01-10', 385.00),
(1,  '2023-06-15', 392.50),
(2,  '2023-01-10', 420.00),
(2,  '2023-06-15', 430.00),
(3,  '2023-02-20', 310.00),
(4,  '2023-02-20', 355.00),
(5,  '2023-03-05', 440.00),
(6,  '2023-03-05', 280.00),
(7,  '2023-04-10', 325.00),
(8,  '2023-04-10', 400.00),
(9,  '2023-01-15', 510.00),
(9,  '2023-07-01', 525.00),
(10, '2023-02-10', 490.00),
(10, '2023-07-01', 500.00),
(11, '2023-03-20', 475.00),
(12, '2023-06-01', 120.00),  
(13, '2023-09-01', 110.00),  
(18, '2023-05-10', 295.00),
(19, '2023-05-10', 270.00),
(20, '2023-06-01', 460.00);



INSERT INTO COLOR_RECORD (CattleID, PrimaryColor, SecondaryColor, Pattern, RecordedDate) VALUES
(1,  'Brown',  'White',  'Patchy',      '2022-01-15'),
(2,  'Black',  'White',  'Spotted',     '2022-01-15'),
(3,  'Brown',  NULL,     'Solid',       '2022-02-10'),
(4,  'Fawn',   'White',  'Patchy',      '2022-02-10'),
(5,  'Black',  'Grey',   'Gradient',    '2022-03-05'),
(6,  'Brown',  'White',  'Spotted',     '2022-03-05'),
(7,  'Fawn',   NULL,     'Solid',       '2022-04-20'),
(8,  'Black',  'White',  'Patchy',      '2022-04-20'),
(9,  'Brown',  NULL,     'Solid',       '2022-05-01'),
(10, 'Black',  'White',  'Spotted',     '2022-05-01'),
(11, 'Fawn',   'Brown',  'Brindle',     '2022-06-10'),
(12, 'Brown',  'White',  'Patchy',      '2023-06-01'),
(13, 'Black',  'White',  'Spotted',     '2023-09-01'),
(18, 'Brown',  NULL,     'Solid',       '2022-09-15'),
(19, 'Black',  'Fawn',   'Gradient',    '2023-01-20');  



INSERT INTO DEATH_RECORD (CattleID, DeathDate, Cause, VetVerified) VALUES
(17, '2023-02-14', 'Respiratory infection', 1);


 -- adding extra cattle rows just for death records
INSERT INTO CATTLE (TagNumber, Name, Breed, Gender, DateOfBirth, Status, FarmID) VALUES
('GVF-H01','OldCow1','Sahiwal','Female','2010-01-01','Dead',1),
('GVF-H02','OldBull1','Nili-Ravi','Male','2010-02-01','Dead',1),
('GVF-H03','OldCow2','Cholistani','Female','2011-03-01','Dead',1),
('GVF-H04','OldBull2','Sahiwal','Male','2011-04-01','Dead',1),
('GVF-H05','OldCow3','Sahiwal','Female','2012-01-01','Dead',1),
('GVF-H06','OldBull3','Nili-Ravi','Male','2012-02-01','Dead',1),
('GVF-H07','OldCow4','Cholistani','Female','2013-01-01','Dead',1),
('GVF-H08','OldBull4','Sahiwal','Male','2013-02-01','Dead',1),
('GVF-H09','OldCow5','Nili-Ravi','Female','2014-01-01','Dead',1),
('GVF-H10','OldBull5','Cholistani','Male','2014-02-01','Dead',1),
('GVF-H11','OldCow6','Sahiwal','Female','2015-01-01','Dead',1),
('GVF-H12','OldBull6','Nili-Ravi','Male','2015-02-01','Dead',1),
('GVF-H13','OldCow7','Cholistani','Female','2016-01-01','Dead',1),
('GVF-H14','OldCow8','Sahiwal','Female','2016-02-01','Dead',1);



DELETE FROM DEATH_RECORD WHERE CattleID = 15;
INSERT INTO DEATH_RECORD (CattleID, DeathDate, Cause, VetVerified) VALUES
(21, '2018-06-10', 'Old age',                     1),
(22, '2019-03-22', 'Foot and mouth disease',       1),
(23, '2019-11-05', 'Pneumonia',                    1),
(24, '2020-01-18', 'Heat stroke',                  0),
(25, '2020-07-30', 'Tick fever',                   1),
(26, '2021-02-14', 'Digestive disorder',           1),
(27, '2021-08-09', 'Old age',                      1),
(28, '2021-12-25', 'Respiratory infection',        0),
(29, '2022-03-17', 'Poisoning (bad feed)',         1),
(30, '2022-06-04', 'Old age',                      1),
(31, '2022-09-21', 'Mastitis complications',       1),
(32, '2023-01-08', 'Accident',                     0),
(33, '2023-04-14', 'Unknown',                      0),
(34, '2023-06-30', 'Tick fever',                   1);



INSERT INTO BREEDING_RECORD (CowID, BullID, BreedingDate, Method, ExpectedDueDate, Outcome) VALUES
(1,  9,  '2022-06-15', 'Natural', '2023-03-25', 'Successful'),
(2,  10, '2022-09-01', 'Natural', '2023-06-10', 'Successful'),
(3,  9,  '2023-01-20', 'AI',      '2023-10-30', 'Pending'),
(4,  11, '2022-03-10', 'Natural', '2022-12-19', 'Successful'),
(5,  9,  '2022-04-05', 'Natural', '2023-01-14', 'Successful'),
(6,  10, '2023-03-18', 'AI',      '2023-12-27', 'Pending'),
(7,  11, '2022-06-25', 'Natural', '2023-04-04', 'Successful'),
(8,  9,  '2022-08-20', 'Natural', '2023-05-29', 'Successful'),
(1,  10, '2021-05-10', 'Natural', '2022-02-18', 'Successful'),
(2,  9,  '2021-08-14', 'Natural', '2022-05-23', 'Successful'),
(4,  11, '2021-01-05', 'AI',      '2021-10-14', 'Failed'),
(5,  10, '2020-11-22', 'Natural', '2021-08-31', 'Successful'),
(7,  9,  '2021-07-30', 'Natural', '2022-05-08', 'Successful'),
(8,  11, '2021-03-12', 'AI',      '2021-12-21', 'Successful'),
(18, 20, '2023-05-01', 'Natural', '2024-02-08', 'Pending');



INSERT INTO CATTLE (TagNumber, Name, Breed, Gender, DateOfBirth, Status, FarmID) VALUES
('GVF-C01','Calf01','Sahiwal',    'Female','2022-02-18','Active',1),  
('GVF-C02','Calf02','Nili-Ravi',  'Male',  '2022-05-23','Active',1),  
('GVF-C03','Calf03','Sahiwal',    'Female','2022-05-08','Active',1),  
('GVF-C04','Calf04','Sahiwal',    'Male',  '2021-12-21','Active',1),  
('GVF-C05','Calf05','Nili-Ravi',  'Female','2021-08-31','Active',1),  
('GVF-C06','Calf06','Cholistani', 'Male',  '2023-01-14','Active',1),  
('GVF-C07','Calf07','Sahiwal',    'Female','2023-03-25','Active',1),  
('GVF-C08','Calf08','Nili-Ravi',  'Male',  '2023-06-10','Active',1),  
('GVF-C09','Calf09','Sahiwal',    'Male',  '2023-04-04','Active',1),  
('GVF-C10','Calf10','Nili-Ravi',  'Female','2023-05-29','Active',1),  
('GVF-C11','Calf11','Cholistani', 'Male',  '2022-06-15','Active',1),  
('GVF-C12','Calf12','Sahiwal',    'Female','2022-09-20','Active',1),  
('GVF-C13','Calf13','Nili-Ravi',  'Male',  '2022-11-30','Active',1);



INSERT INTO BIRTH_RECORD (MotherID, CalfID, BreedingID, BirthDate, BirthWeight, Complications) VALUES
(1,  41, 1,    '2023-03-25', 28.5, NULL),
(2,  42, 2,    '2023-06-10', 32.0, NULL),
(4,  12, 4,    '2023-04-02', 26.0, 'Mild dystocia'),
(5,  40, 5,    '2023-01-14', 30.5, NULL),
(7,  43, 7,    '2023-04-04', 27.0, NULL),
(8,  44, 8,    '2023-05-29', 31.5, NULL),
(1,  35, 9,    '2022-02-18', 29.0, NULL),
(2,  36, 10,   '2022-05-23', 33.0, NULL),
(5,  39, 12,   '2021-08-31', 28.0, NULL),
(7,  37, 13,   '2022-05-08', 26.5, NULL),
(8,  38, 14,   '2021-12-21', 30.0, 'Premature by 1 week'),
(2,  13, NULL, '2023-07-18', 29.5, NULL),
(4,  45, NULL, '2022-06-15', 27.0, NULL),
(7,  46, NULL, '2022-09-20', 25.5, NULL),
(3,  47, NULL, '2022-11-30', 28.0, 'Breech position');



INSERT INTO PURCHASE_RECORD (CattleID, UserID, SellerName, PurchaseDate, PurchasePrice, MarketName) VALUES
(1,  2, 'Haji Muhammad Akram',   '2021-01-10', 85000.00,  'Mianwali Cattle Market'),
(2,  2, 'Chaudhry Liaqat Ali',   '2020-07-22', 120000.00, 'Sargodha Livestock Mandi'),
(3,  2, 'Malik Shahbaz',         '2021-03-05', 70000.00,  'Mianwali Cattle Market'),
(4,  2, 'Rauf Cattle Farm',      '2021-06-18', 78000.00,  'Bhakkar Mandi'),
(5,  2, 'Haji Bashir Ahmed',     '2019-11-30', 130000.00, 'Faisalabad Livestock'),
(6,  2, 'Allah Ditta Farms',     '2022-01-15', 55000.00,  'Mianwali Cattle Market'),
(7,  2, 'Ghulam Rasool',         '2021-09-10', 72000.00,  'Sargodha Livestock Mandi'),
(8,  2, 'Noor Muhammad',         '2020-12-05', 105000.00, 'Lahore Cattle Fair'),
(9,  2, 'Sultan Cattle Breeders','2019-04-10', 180000.00, 'Faisalabad Livestock'),
(10, 2, 'Mian Nawaz Cattle',     '2020-09-25', 160000.00, 'Sargodha Livestock Mandi'),
(11, 2, 'Arif Brothers Farm',    '2021-06-07', 145000.00, 'Bhakkar Mandi'),
(15, 2, 'Haji Qasim',            '2018-03-20', 95000.00,  'Mianwali Cattle Market'),
(16, 2, 'Umar Livestock',        '2018-08-11', 110000.00, 'Lahore Cattle Fair'),
(18, 2, 'Rehmat Ali Farm',       '2022-08-09', 62000.00,  'Mianwali Cattle Market'),
(20, 2, 'Tariq Bull Farm',       '2021-03-22', 155000.00, 'Sargodha Livestock Mandi');




INSERT INTO CATTLE (TagNumber, Name, Breed, Gender, DateOfBirth, Status, FarmID) VALUES
('GVF-S01','SoldCow1', 'Sahiwal',    'Female','2014-01-01','Sold',1), -- ID 48
('GVF-S02','SoldBull1','Nili-Ravi',  'Male',  '2014-02-01','Sold',1), -- ID 49
('GVF-S03','SoldCow2', 'Cholistani', 'Female','2015-01-01','Sold',1), -- ID 50
('GVF-S04','SoldBull2','Sahiwal',    'Male',  '2015-02-01','Sold',1), -- ID 51
('GVF-S05','SoldCow3', 'Nili-Ravi',  'Female','2016-01-01','Sold',1), -- ID 52
('GVF-S06','SoldCow4', 'Sahiwal',    'Female','2016-03-01','Sold',1), -- ID 53
('GVF-S07','SoldBull3','Cholistani', 'Male',  '2017-01-01','Sold',1), -- ID 54
('GVF-S08','SoldCow5', 'Sahiwal',    'Female','2017-02-01','Sold',1), -- ID 55
('GVF-S09','SoldBull4','Nili-Ravi',  'Male',  '2017-03-01','Sold',1), -- ID 56
('GVF-S10','SoldCow6', 'Cholistani', 'Female','2018-01-01','Sold',1), -- ID 57
('GVF-S11','SoldBull5','Sahiwal',    'Male',  '2018-04-01','Sold',1), -- ID 58
('GVF-S12','SoldCow7', 'Nili-Ravi',  'Female','2019-01-01','Sold',1), -- ID 59
('GVF-S13','SoldCow8', 'Cholistani', 'Female','2019-06-01','Sold',1);


-- Purchase records for the above sold cattle
INSERT INTO PURCHASE_RECORD (CattleID, UserID, SellerName, PurchaseDate, PurchasePrice, MarketName) VALUES
(48, 2, 'Old Seller A',  '2016-01-10', 70000.00, 'Mianwali Cattle Market'),
(49, 2, 'Old Seller B',  '2016-02-10', 90000.00, 'Bhakkar Mandi'),
(50, 2, 'Old Seller C',  '2017-01-10', 75000.00, 'Sargodha Livestock Mandi'),
(51, 2, 'Old Seller D',  '2017-02-10', 95000.00, 'Mianwali Cattle Market'),
(52, 2, 'Old Seller E',  '2018-01-10', 80000.00, 'Lahore Cattle Fair'),
(53, 2, 'Old Seller F',  '2018-03-15', 72000.00, 'Mianwali Cattle Market'),
(54, 2, 'Old Seller G',  '2019-01-10', 110000.00,'Faisalabad Livestock'),
(55, 2, 'Old Seller H',  '2019-02-10', 68000.00, 'Bhakkar Mandi'),
(56, 2, 'Old Seller I',  '2019-03-10', 105000.00,'Sargodha Livestock Mandi'),
(57, 2, 'Old Seller J',  '2020-01-10', 78000.00, 'Mianwali Cattle Market'),
(58, 2, 'Old Seller K',  '2020-04-10', 115000.00,'Lahore Cattle Fair'),
(59, 2, 'Old Seller L',  '2021-01-10', 88000.00, 'Faisalabad Livestock'),
(60, 2, 'Old Seller M',  '2021-06-10', 92000.00, 'Bhakkar Mandi');



SET @OLD_SALE_TRIGGER = 'disabled';


INSERT INTO SALE_RECORD (CattleID, UserID, BuyerName, SaleDate, SalePrice, MarketName) VALUES
(15, 2, 'Buyer Rehman',        '2023-01-15', 115000.00, 'Mianwali Cattle Market'),
(16, 2, 'Buyer Shahzad',       '2023-02-20', 130000.00, 'Sargodha Livestock Mandi'),
(48, 2, 'Buyer Ali',           '2019-03-10', 88000.00,  'Bhakkar Mandi'),
(49, 2, 'Buyer Akbar',         '2019-04-05', 105000.00, 'Mianwali Cattle Market'),
(50, 2, 'Buyer Javed',         '2020-02-14', 90000.00,  'Lahore Cattle Fair'),
(51, 2, 'Buyer Nisar',         '2020-03-20', 115000.00, 'Faisalabad Livestock'),
(52, 2, 'Buyer Tariq',         '2021-03-01', 98000.00,  'Sargodha Livestock Mandi'),
(53, 2, 'Buyer Waseem',        '2021-04-10', 85000.00,  'Mianwali Cattle Market'),
(54, 2, 'Buyer Arshad',        '2022-01-18', 135000.00, 'Bhakkar Mandi'),
(55, 2, 'Buyer Zafar',         '2022-02-22', 82000.00,  'Lahore Cattle Fair'),
(56, 2, 'Buyer Kamran',        '2022-03-30', 125000.00, 'Faisalabad Livestock'),
(57, 2, 'Buyer Saleem',        '2023-01-05', 95000.00,  'Mianwali Cattle Market'),
(58, 2, 'Buyer Imtiaz',        '2023-02-11', 140000.00, 'Sargodha Livestock Mandi'),
(59, 2, 'Buyer Farhan',        '2023-03-17', 108000.00, 'Bhakkar Mandi'),
(60, 2, 'Buyer Bilal',         '2023-04-25', 112000.00, 'Lahore Cattle Fair');



-- Manual entries only for cattle that died (no sale price)
INSERT INTO PROFIT_LOSS_RECORD (CattleID, PurchaseID, SaleID, ProfitLoss, CalculationDate) VALUES
(17, NULL, NULL, -110000.00, '2023-02-14');




-- Update milk production after a measurement
 UPDATE COW SET MilkProduction = 13.50 WHERE CattleID = 1;

-- Update breeding outcome after vet confirmation
UPDATE BREEDING_RECORD SET Outcome = 'Successful' WHERE BreedingID = 3;

 
-- Delete an incorrect weight record (hypothetical duplicate)
DELETE FROM WEIGHT_RECORD WHERE WeightID = 999; 
 
-- Delete a breeding record that was entered by mistake
DELETE FROM BREEDING_RECORD WHERE BreedingID = 999;

SET FOREIGN_KEY_CHECKS = 1;