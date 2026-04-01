<?php
require __DIR__ . '/../vendor/autoload.php';

$http = (new \think\App())->http;
$response = $http->run();

// Connect to DB directly
$conn = new mysqli('naqrah_db', 'root', 'root', 'crmeb_db');
$conn->set_charset("utf8mb4");

$res = $conn->query("SELECT id, menu_name FROM eb_system_menus");

$translated_cache = [];

function translate($text, &$cache) {
    if (isset($cache[$text])) return $cache[$text];
    
    // Skip if empty or clearly not Chinese (e.g. standard English paths)
    if (trim($text) == '' || preg_match('/^[a-zA-Z0-9_.\-\/ ]+$/', $text)) {
        return $text;
    }
    
    $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=ar&dt=t&q=" . urlencode($text);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    curl_close($ch);
    
    if ($response) {
        $json = json_decode($response, true);
        if (isset($json[0][0][0])) {
            $cache[$text] = $json[0][0][0];
            return $json[0][0][0];
        }
    }
    return $text; // fallback
}

$count = 0;
while($row = $res->fetch_assoc()) {
    $id = $row['id'];
    $menu_name = $row['menu_name'];
    
    $translated = translate($menu_name, $translated_cache);
    
    if ($translated != $menu_name && $translated != '') {
        $stmt = $conn->prepare("UPDATE eb_system_menus SET menu_name = ? WHERE id = ?");
        $stmt->bind_param("si", $translated, $id);
        $stmt->execute();
        $count++;
        echo "Translated ID {$id}: {$menu_name} -> {$translated}\n";
        usleep(50000); // 50ms pause to avoid rate limiting
    }
}
$conn->close();
echo "Done! Translated {$count} items.\n";
