<?php
require __DIR__.'/Directus/DirectusCollection.php';
require __DIR__.'/Mastodon/Post.php';
require __DIR__.'/Template/Template.php';

header('Content-Type: text/html');

define('DEV', (isset($_GET['dev']) || isset($_GET['DEV'])) ? TRUE : FALSE);

error_reporting(E_ALL);
if (DEV) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
} else {
	ini_set('log_errors', 1);
	ini_set('error_log', $_SERVER['SERVER_ROOT'] . '/var/log/PHP.Errors.' . date("Y-m-d") . '.log');
}

$env = getenv();

if (!isset($_GET['path']) || strlen($_GET['path']) == 0) {
	http_response_code(422);
	exit();
}

function findMatchingPost(string $path, array $postList) {
	foreach ($postList as $post) {
		if ($post['post_path'] == $path) {
			return $post;
		}
	}

	return null;
}

$DirectusCollection = new Directus\Collection($env['DIRECTUS_HOSTNAME'], $env['DIRECTUS_TOKEN']);
$postMappingList = $DirectusCollection->getItems('PostMastodonMapping');
if ($postMappingList) {
	$postMappingListData = json_decode($postMappingList, TRUE);
	$foundPost = findMatchingPost($_GET['path'], $postMappingListData['data']);

	if ($foundPost) {
		$MastodonPost = new Mastodon\Post($foundPost['mastodon_host']);
		$postReplies = $MastodonPost->getStatusContext($foundPost['mastodon_post_id']);

		$Template = new Template\Template();
		echo $Template->render('comments.html.twig',['name'=>'Gustav']);
//		foreach ($postReplies['descendants'] as $reply) {
//			echo "<p>{$reply['content']}</p>";
//		}
	} else {
		http_response_code(404);
		exit();
	}
} else {
	http_response_code(404);
	exit();
}
