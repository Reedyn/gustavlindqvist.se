<?php

namespace Template;
require __DIR__ . '/../vendor/autoload.php';

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
