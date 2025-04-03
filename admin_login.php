<?php
session_start();
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $admin_username = $_POST['admin_username'];
    $admin_password = $_POST['admin_password'];

    $query = "SELECT * FROM admins WHERE admin_username='$admin_username' AND admin_password='$admin_password'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) == 1) {
        $_SESSION['admin_username'] = $admin_username;
        header("Location: admin_dashboard.php");
    } else {
        echo "Invalid admin credentials";
    }
}
?>
