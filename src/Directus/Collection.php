<?php

namespace src\Directus;
class Collection {
	protected string $hostname;
	protected string $token;

	/**
	 * @param int $hostname
	 */
	public function __construct(string $hostname, string $token) {
		$this->hostname = $hostname;
		$this->token = $token;
	}

	/**
	 * @param string $collection_name
	 *
	 * @return bool|string
	 */
	public function getMetadata(string $collection_name) {
		$ch = curl_init();

		$url = $this->hostname . '/collections/' . $collection_name;
		curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $this->token]);
		curl_setopt($ch, CURLOPT_URL, $url);
		$response = curl_exec($ch);
		curl_close($ch);

		return $response;
	}

	/**
	 * @param string $collection_name
	 *
	 * @return bool|string
	 */
	public function getItems(string $collection_name) {
		$ch = curl_init();

		$url = $this->hostname . '/items/' . $collection_name;
		curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $this->token]);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_URL, $url);
		$response = curl_exec($ch);
		$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		if ($httpcode == 200) {
			return $response;
		}

		return null;
	}

	public function testAccess() {

		$ch = curl_init();

		$url = $this->hostname . '/users/me';
		curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $this->token]);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_URL, $url);
		$response = curl_exec($ch);
		curl_close($ch);

		return $response;
	}
}
