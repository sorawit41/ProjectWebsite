<?php
    function imageResize($targetWidth,$targetHeight,$imageResourceId,$width,$height) {

        $targetLayer=imagecreatetruecolor($targetWidth,$targetHeight);
        imagecopyresampled($targetLayer,$imageResourceId,0,0,0,0,$targetWidth,$targetHeight, $width,$height);

        return $targetLayer;
    }

/*     public function getImageResized($image, int $newWidth, int $newHeight) {
        $newImg = imagecreatetruecolor($newWidth, $newHeight);     
        imagealphablending($newImg, false);
        imagesavealpha($newImg, true);
        $transparent = imagecolorallocatealpha($newImg, 255, 255, 255, 127);
        imagefilledrectangle($newImg, 0, 0, $newWidth, $newHeight, $transparent);
        $src_w = imagesx($image);
        $src_h = imagesy($image);
        imagecopyresampled($newImg, $image, 0, 0, 0, 0, $newWidth, $newHeight, $src_w, $src_h);
        return $newImg;
    } */

    function getImageResized($targetWidth,$targetHeight,$imageResourceId,$width,$height) {
        //$image, int $newWidth, int $newHeight

        $newImg=imagecreatetruecolor($targetWidth,$targetHeight);
        imagealphablending($newImg, false);
        imagesavealpha($newImg, true);
        $transparent = imagecolorallocatealpha($newImg, 255, 255, 255, 127);
        imagefilledrectangle($newImg, 0, 0, $targetWidth,$targetHeight, $transparent);

        imagecopyresampled($newImg,$imageResourceId,0,0,0,0,$targetWidth,$targetHeight, $width,$height);

        return $newImg;

    }

    function upload_image($path,$path_thumbnail,$filename,$fileNewName,$perc,$thumbnail_perc){

        if(is_array($_FILES)) {
            
            $file = $filename['tmp_name']; 
            $sourceProperties = getimagesize($file);
            $imageType = $sourceProperties[2];

            list($width, $height, $type) = getimagesize($file);
            $rwidth = ceil($width * $perc);
            $rheight = ceil($height * $perc);
            $tbrwidth = ceil($width * $thumbnail_perc);
            $tbrheight = ceil($height * $thumbnail_perc);

            switch ($imageType) {
                case IMAGETYPE_PNG:
/*                     $imageResourceId = imagecreatefrompng($file); // $img = imagecreatefrompng($file); 
                    $targetLayer = imageResize($rwidth,$rheight,$imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                    $targetLayer_thumbnail = imageResize($tbrwidth,$tbrheight,$imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                    imagepng($targetLayer,$path . basename($fileNewName));
                    imagepng($targetLayer_thumbnail,$path_thumbnail . basename($fileNewName));
                    break; */

                    $imageResourceId = imagecreatefrompng($file); // $img = imagecreatefrompng($file); 

                    $targetLayer = getImageResized($rwidth,$rheight,$imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                    $targetLayer_thumbnail = getImageResized($tbrwidth,$tbrheight,$imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                    imagepng($targetLayer,$path . basename($fileNewName));
                    imagepng($targetLayer_thumbnail,$path_thumbnail . basename($fileNewName));
                    break;


                case IMAGETYPE_GIF:
                    $imageResourceId = imagecreatefromgif($file); 
                    $targetLayer = imageResize($rwidth,$rheight,$imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                    $targetLayer_thumbnail = imageResize($tbrwidth,$tbrheight,$imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                    imagegif($targetLayer,$path . basename($fileNewName));
                    imagegif($targetLayer_thumbnail,$path_thumbnail . basename($fileNewName));
                    break;

                case IMAGETYPE_JPEG:
                    $imageResourceId = imagecreatefromjpeg($file); 
                    $targetLayer = imageResize($rwidth,$rheight,$imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                    $targetLayer_thumbnail = imageResize($tbrwidth,$tbrheight,$imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                    imagejpeg($targetLayer,$path . basename($fileNewName));
                    imagejpeg($targetLayer_thumbnail,$path_thumbnail . basename($fileNewName));
                    break;

                default:
                    // echo "Invalid Image type.";
                    exit;
                    break;
            }

            // move_uploaded_file($file, $folderPath. $fileNewName. ".". $ext);
            // move_uploaded_file($file, $folderPath. basename($fileNewName));
            // echo "Image Resize Successfully.";
        }
    }
?>