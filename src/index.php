<?php
require 'Directus.php';
use Directus\Directus;

header('Content-Type: application/json');

$env = getenv();

$Directus = new Directus($env['DIRECTUS_HOSTNAME'], $env['DIRECTUS_TOKEN']);
echo $Directus->getItems('MastodonComments');


?>
