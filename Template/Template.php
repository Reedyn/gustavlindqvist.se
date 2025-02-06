<?php

namespace Template;
require __DIR__.'/../vendor/autoload.php';

define('DEV', (isset($_GET['dev']) || isset($_GET['DEV'])) ? TRUE : FALSE);

error_reporting(E_ALL);
if (DEV) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
} else {
	ini_set('log_errors', 1);
	ini_set('error_log', $_SERVER['SERVER_ROOT'] . '/var/log/PHP.Errors.' . date("Y-m-d") . '.log');
}

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

class Template {
	protected $twig;

	public function __construct() {
		$loader = new FilesystemLoader(__DIR__ . '/templates');
		$this->twig = new Environment($loader);
	}

	/**
	 * @throws \Twig\Error\SyntaxError
	 * @throws \Twig\Error\RuntimeError
	 * @throws \Twig\Error\LoaderError
	 */
	public function render($templateName, $data) {
		return $this->twig->render($templateName, $data);
	}
}
