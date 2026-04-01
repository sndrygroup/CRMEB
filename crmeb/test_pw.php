<?php
$db = new PDO('mysql:host=naqrah_db;dbname=crmeb_db', 'root', 'root');
$stmt = $db->query("SELECT pwd FROM eb_system_admin WHERE account='admin'");
$pwd = $stmt->fetchColumn();
var_dump($pwd);
var_dump(password_verify('123456', $pwd));
