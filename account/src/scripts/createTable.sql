CREATE OR REPLACE TABLE `ACCOUNT_DB`.`ACCOUNT` (
  `key` VARCHAR(50) NOT NULL,
  `is_admin` TINYINT(1) NOT NULL,
  `name` VARCHAR(50),
  `request_limit` INT NOT NULL,
  PRIMARY KEY(`key`)
);