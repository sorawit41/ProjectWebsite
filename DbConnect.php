<?php
date_default_timezone_set("Asia/Bangkok");
// echo date_default_timezone_get();
/**Emergency emergency
 * Database Connection 192.168.1.111
 */
class DbConnect
{

	private $server = '127.0.0.1:3306';
	private $dbname = 'u916117432_blackneko';
	private $user = 'u916117432_blackneko';
	private $pass = '4b@aF&oU';  

	public function connect()
	{
		try {
			$conn = new PDO('mysql:host=' . $this->server . ';dbname=' . $this->dbname . '; charset=UTF8', $this->user, $this->pass);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			return $conn;
		} catch (\Exception $e) {
			echo "Database Error: " . $e->getMessage();
		}
	}

}

function randomPassword()
{
	$alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	$pass = array(); //remember to declare $pass as an array
	$alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
	for ($i = 0; $i < 8; $i++) {
		$n = rand(0, $alphaLength);
		$pass[] = $alphabet[$n];
	}
	return implode($pass); //turn the array into a string
}
?>