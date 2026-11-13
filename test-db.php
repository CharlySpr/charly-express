<?php
header("Content-Type: application/json; charset=UTF-8");

$databaseUrl = getenv('DATABASE_URL');
if (!$databaseUrl) {
    echo json_encode(["success" => false, "message" => "DATABASE_URL is missing in Vercel."]);
    exit();
}

$dbParts = parse_url($databaseUrl);
$host = $dbParts['host'] ?? '';
$port = $dbParts['port'] ?? 5432;
$user = $dbParts['user'] ?? '';
$pass = $dbParts['pass'] ?? '';
$dbname = ltrim($dbParts['path'] ?? '', '/');

$hostParts = explode('.', $host);
$endpointId = $hostParts[0] ?? '';

$dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require";
if ($endpointId) {
    $dsn .= ";options=endpoint%3D" . $endpointId;
}

try {
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $stmt = $pdo->query("SELECT NOW() as current_time_db, current_database() as db_name");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => "Successfully connected to Neon PostgreSQL!",
        "data" => $result
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Connection failed: " . $e->getMessage()
    ]);
}
?>
