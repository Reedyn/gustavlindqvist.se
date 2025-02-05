<?php

class Mastodon {
	protected string $hostname;

	public function __construct(string $hostname) {
		$this->hostname = $hostname;
	}

	public function getStatusContext ($mastodon_post_id) {
		$ch = curl_init();
		$url = $this->hostname . '/api/v1/statuses/' . $mastodon_post_id . '/context';
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_URL, $url);
		$response = curl_exec($ch);
		$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		if ($httpcode == 200){
			return json_decode($response, true);
		}
		return null;
	}
}
