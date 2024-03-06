<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240305094158 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create MarcheBackUp and MarcheUserModified';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE marche_de_france_backup (id INT AUTO_INCREMENT NOT NULL, clenum VARCHAR(50) DEFAULT NULL, denomination_f VARCHAR(255) NOT NULL, adresse VARCHAR(255) NOT NULL, codpost VARCHAR(255) NOT NULL, villenorm VARCHAR(255) NOT NULL, commune VARCHAR(255) NOT NULL, codinsee VARCHAR(255) DEFAULT NULL, specificite VARCHAR(255) DEFAULT NULL, jour_de_marche_1 VARCHAR(255) DEFAULT NULL, jour_de_marche_2 VARCHAR(255) DEFAULT NULL, jour_de_marche_3 VARCHAR(255) DEFAULT NULL, jour_de_marche_4 VARCHAR(255) DEFAULT NULL, jour_de_marche_5 VARCHAR(255) DEFAULT NULL, jour_de_marche_6 VARCHAR(255) DEFAULT NULL, jour_de_marche_7 VARCHAR(255) DEFAULT NULL, poi_x NUMERIC(16, 14) NOT NULL, poi_y NUMERIC(16, 14) NOT NULL, poi_qualitegeorue VARCHAR(50) DEFAULT NULL, dcomiris VARCHAR(50) DEFAULT NULL, dep VARCHAR(5) NOT NULL, date_data VARCHAR(50) DEFAULT NULL, date_inser VARCHAR(50) DEFAULT NULL, marche_id INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE marche_de_france_user_modify (id INT AUTO_INCREMENT NOT NULL, clenum VARCHAR(50) DEFAULT NULL, denomination_f VARCHAR(255) NOT NULL, adresse VARCHAR(255) NOT NULL, codpost VARCHAR(255) NOT NULL, villenorm VARCHAR(255) NOT NULL, commune VARCHAR(255) NOT NULL, codinsee VARCHAR(255) DEFAULT NULL, specificite VARCHAR(255) DEFAULT NULL, jour_de_marche_1 VARCHAR(255) DEFAULT NULL, jour_de_marche_2 VARCHAR(255) DEFAULT NULL, jour_de_marche_3 VARCHAR(255) DEFAULT NULL, jour_de_marche_4 VARCHAR(255) DEFAULT NULL, jour_de_marche_5 VARCHAR(255) DEFAULT NULL, jour_de_marche_6 VARCHAR(255) DEFAULT NULL, jour_de_marche_7 VARCHAR(255) DEFAULT NULL, poi_x NUMERIC(16, 14) NOT NULL, poi_y NUMERIC(16, 14) NOT NULL, poi_qualitegeorue VARCHAR(50) DEFAULT NULL, dcomiris VARCHAR(50) DEFAULT NULL, dep VARCHAR(5) NOT NULL, date_data VARCHAR(50) DEFAULT NULL, date_inser VARCHAR(50) DEFAULT NULL, user_id INT NOT NULL, marche_id INT NOT NULL, status INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {}
}
