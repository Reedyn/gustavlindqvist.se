<?php
require 'Directus/Collection.php';
require 'Mastodon.php';

header('Content-Type: text/html');

$env = getenv();

if (!isset($_GET['path']) || strlen($_GET['path']) == 0) {
	http_response_code(422);
	exit();
}

function findMatchingPost (string $path, array $postList) {
	foreach ($postList as $post) {
		if ($post['post_path'] == $path) {
			return $post;
		}
	}
	return null;
}

$DirectusCollection = new Collection($env['DIRECTUS_HOSTNAME'], $env['DIRECTUS_TOKEN']);
$postMappingList = $DirectusCollection->getItems('PostMastodonMapping');
if ($postMappingList) {
	$postMappingListData = json_decode($postMappingList, true);

	$foundPost = findMatchingPost($_GET['path'], $postMappingListData['data']);

	if ($foundPost) {

		$Mastodon = new Mastodon($foundPost['mastodon_host']);
		$postReplies = $Mastodon->getStatusContext($foundPost['mastodon_post_id']);
		echo '<pre>';
		var_export($postReplies['descendants']);
		echo '</pre>';
	} else {
		http_response_code(404);
	}

} else {
	http_response_code(404);
}

?>
