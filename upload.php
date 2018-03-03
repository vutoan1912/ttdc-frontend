<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Form upload file trong PHP</title>
</head>
<body>
<?php
// Kiểm tra phương thức gửi form đi có phải là POST hay ko ?
if($_SERVER["REQUEST_METHOD"] == "POST"){
    // Kiểm tra quá trình upload file có bị lỗi gì không ?
    if(isset($_FILES["photo"]) && $_FILES["photo"]["error"] == 0){
        // Mảng chưa định dạng file cho phép
        $allowed = array("jpg" => "image/jpg", "jpeg" => "image/jpeg", "gif" => "image/gif", "png" => "image/png", "zip" => "application/zip, application/octet-stream");
        // Lấy thông tin file bao gồm tên file, loại file, kích cỡ file
        $filename = $_FILES["photo"]["name"];
        $filetype = $_FILES["photo"]["type"];
        $filesize = $_FILES["photo"]["size"];

        // Kiểm tra định dạng file .jpg, png,...
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        // Nếu không đúng định dạng file thì báo lỗi
        if(!array_key_exists($ext, $allowed)) die("Lỗi : Vui lòng chọn đúng định dang file.");

        // Cho phép kích thước tối đa của file là 5MB
        $maxsize = 50 * 1024 * 1024;
        // Nếu kích thước lớn hơn 5MB thì báo lỗi
        if($filesize > $maxsize) die("Lỗi : Kích thước file lớn hơn giới hạn cho phép");

        // Kiểm tra file ok hết chưa
        if(in_array($filetype, $allowed)){
            // Kiểm tra xem file đã tồn tại chưa, nếu rồi thì báo lỗi, không thì tiến hành upload
            if(file_exists("upload/" . $_FILES["photo"]["name"])){
                echo $_FILES["photo"]["name"] . " đã tồn tại";
            } else{
                // Hàm move_uploaded_file sẽ tiến hành upload file lên thư mục upload
                $rs = move_uploaded_file($_FILES["photo"]["tmp_name"], "upload/" . $_FILES["photo"]["name"]);
                var_dump($rs);
                // Thông báo thành công
                echo "Upload file thành công";
            }
        } else{
            echo "Lỗi : Có vấn đề xảy ra khi upload file";
        }
    } else{
        echo "Lỗi: " . $_FILES["photo"]["error"];
    }
}
?>
<form action="upload.php" method="post" enctype="multipart/form-data">
    <h2>Form Upload File PHP</h2>
    <label for="fileSelect">Tên file:</label>
    <input type="file" name="photo" id="fileSelect">
    <input type="submit" name="submit" value="Upload file">
    <p><strong>Ghi chú:</strong> Chỉ cho phép định dạng .jpg, .jpeg, .gif và kích thước tối đa tệp tin là 5MB.</p>
</form>
</body>
</html>