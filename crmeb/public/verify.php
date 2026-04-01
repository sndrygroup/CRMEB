<?php
$conn = new mysqli('naqrah_db', 'root', 'root', 'crmeb_db');
$res = $conn->query("SELECT * FROM eb_system_admin WHERE account='admin'");
$row = $res->fetch_assoc();
echo "Stored Hash: " . $row['pwd'] . "\n";
echo "Password verified: " . (password_verify('123456', $row['pwd']) ? 'YES' : 'NO') . "\n";
$conn->close();
?>
