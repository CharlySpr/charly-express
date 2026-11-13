<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$databaseUrl = getenv('DATABASE_URL');
if (!$databaseUrl) {
    echo json_encode([
        "success" => false, 
        "message" => "Database Connection Failed: DATABASE_URL environment variable is missing on Vercel."
    ]);
    exit();
}

$dbParts = parse_url($databaseUrl);
$host = $dbParts['host'] ?? '';
$port = $dbParts['port'] ?? 5432;
$user = $dbParts['user'] ?? '';
$pass = $dbParts['pass'] ?? '';
$dbname = ltrim($dbParts['path'] ?? '', '/');

// Extract endpoint ID from the first part of the Neon subdomain
$hostParts = explode('.', $host);
$endpointId = $hostParts[0] ?? '';

// Build the DSN with enforced endpoint options for Neon SNI support
$dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require";
if ($endpointId) {
    $dsn .= ";options=endpoint%3D" . $endpointId;
}

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Database Connection Failed: " . $e->getMessage()
    ]);
    exit();
}

$action = $_GET['action'] ?? '';

if ($action === 'register') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = trim($data['email'] ?? '');
    $phone = '+237' . preg_replace('/\D/', '', $data['phone'] ?? '');
    $town = trim($data['town'] ?? '');
    $quarter = trim($data['quarter'] ?? '');
    $password = $data['password'] ?? '';

    if (empty($email) || empty($phone) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
        exit();
    }

    try {
        $check = $pdo->prepare("SELECT id FROM users WHERE email = ? OR phone = ?");
        $check->execute([$email, $phone]);
        if ($check->fetch()) {
            echo json_encode(["success" => false, "message" => "An account with this email or phone already exists."]);
            exit();
        }

        $username = explode('@', $email)[0];
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO users (username, email, phone, password, role, town, quarter) VALUES (?, ?, ?, ?, 'user', ?, ?) RETURNING id, username, email, role, town, quarter, phone");
        $stmt->execute([$username, $email, $phone, $hashedPassword, $town, $quarter]);
        $newUser = $stmt->fetch();

        echo json_encode(["success" => true, "user" => $newUser, "message" => "Account created successfully!"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Registration database error: " . $e->getMessage()]);
    }
    exit();
}

echo json_encode(["success" => false, "message" => "Invalid API action requested."]);
?>
