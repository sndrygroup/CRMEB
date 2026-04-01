<?php
require __DIR__ . '/../vendor/autoload.php';

// Try to initialize thinkphp to use services
$http = (new \think\App())->http;
$response = $http->run();
$services = app()->make(\app\services\system\admin\SystemAdminServices::class);

try {
    $adminInfo = $services->verifyLogin('admin', '123456');
    if ($adminInfo) {
        echo "Login Success!\n";
        print_r($adminInfo->toArray());
    } else {
        echo "Login Failed (returned false).\n";
    }
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}
