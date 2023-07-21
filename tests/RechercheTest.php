<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class RechercheTest extends WebTestCase
{
    public function testSomething(): void
    {
        $client = static::createClient();

        //$resto = $client->request('GET', '/search/restaurant', ["cles0"=> "", "cles1"=> "2 RUE ABREUVOIR 75018 PARIS"]);

        $client->request('GET', '/connexion');
        //echo "Resto\n";
        //print_r($connexion);

        //$this->assertResponseIsSuccessful();

        $this->assertResponseStatusCodeSame(\Response::HTTP_OK);

        //$this->assertSelectorTextContains('h1', 'Connectez-vous!');
    }
}
