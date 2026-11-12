<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse Neon DATABASE_URL from Vercel Environment Variables
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

// Extract Neon endpoint ID from the subdomain for SNI support
$hostParts = explode('.', $host);
$endpointId = $hostParts[0] ?? '';

$dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require";
if ($endpointId && strpos($databaseUrl, 'options=endpoint') === false) {
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

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'get_categories') {
    try {
        $stmt = $pdo->query("SELECT * FROM categories ORDER BY id ASC");
        $categories = $stmt->fetchAll();
        echo json_encode(["success" => true, "categories" => $categories]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Failed to fetch categories: " . $e->getMessage()]);
    }
    exit();
}

if ($action === 'get_products') {
    try {
        $stmt = $pdo->query("SELECT * FROM products ORDER BY id DESC");
        $products = $stmt->fetchAll();
        echo json_encode(["success" => true, "products" => $products]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Failed to fetch products: " . $e->getMessage()]);
    }
    exit();
}

if ($action === 'login') {
    $data = json_decode(file_get_contents("php://input"), true);
    $loginInput = trim($data['loginInput'] ?? '');
    $password = $data['password'] ?? '';

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR username = ? OR phone = ?");
        $stmt->execute([$loginInput, $loginInput, $loginInput]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']);
            echo json_encode(["success" => true, "user" => $user]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid email, username, or password."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Login query failed: " . $e->getMessage()]);
    }
    exit();
}

if ($action === 'google_auth') {
    $data = json_decode(file_get_contents("php://input"), true);
    $credential = $data['credential'] ?? '';
    
    $parts = explode(".", $credential);
    if (count($parts) === 3) {
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
        if ($payload && isset($payload['email'])) {
            $email = $payload['email'];
            $name = $payload['name'] ?? 'Google User';
            
            try {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
                $stmt->execute([$email]);
                $user = $stmt->fetch();

                if ($user) {
                    unset($user['password']);
                    echo json_encode(["success" => true, "user" => $user, "message" => "Google sign-in successful!"]);
                } else {
                    $ins = $pdo->prepare("INSERT INTO users (username, email, phone, password, role, town, quarter) VALUES (?, ?, '', '', 'user', '', '') RETURNING id, username, email, role, town, quarter");
                    $ins->execute([$name, $email]);
                    $newUser = $ins->fetch();
                    echo json_encode(["success" => true, "user" => $newUser, "message" => "Account created via Google!"]);
                }
            } catch (PDOException $e) {
                echo json_encode(["success" => false, "message" => "Google auth database error: " . $e->getMessage()]);
            }
            exit();
        }
    }
    echo json_encode(["success" => false, "message" => "Invalid Google token."]);
    exit();
}

echo json_encode(["success" => false, "message" => "Invalid API action requested."]);
?>
