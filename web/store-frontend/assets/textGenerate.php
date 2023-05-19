<?php
ob_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: *");
header("Access-Control-Expose-Headers: *");
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// Set the command parameters
$text = (isset($_GET['text']) ? $_GET['text'] : "Hello World!");
// $text = strtoupper($text);
$fontName = (isset($_GET['fontName']) ? $_GET['fontName'] : "ABeeZee");
$font_path = "/var/www/html/staging.whattocookai.com/all-google-fonts-ttf-only/fonts/$fontName-Regular.ttf";
$font_size = (isset($_GET['font_size']) ? $_GET['font_size'] : 30);
$text_color = (isset($_GET['font_color']) ? "#".$_GET['font_color'] : "#000000");
$outline_color = (isset($_GET['outline_color']) ? "#".$_GET['outline_color'] : "none");
// $background_color = (isset($_GET['background_color']) ? $_GET['background_color'] : "transparent");
$background_color = "none";
$outline_width = (isset($_GET['outline_width']) ? $_GET['outline_width'] : "0.01");
if($outline_width=="0.00"){
    $outline_color = $text_color;
    $outline_width = "0.01";
}
$effect = (isset($_GET['effect']) ? $_GET['effect'] : "normal");
$depth = 0.5;
$output_file = md5(time()).time().".png";
$strSize = strlen($text); 
$angle = 360;
if($strSize >0 && $strSize <2)
    $angle = 0;
else if($strSize >=2 && $strSize <=5)
    $angle = 10*$strSize;
else if($strSize >=6 && $strSize <=10)
    $angle = 10*$strSize;
else if($strSize >=11 && $strSize <=20)
    $angle =10*$strSize;
else if($strSize >=21 && $strSize <=31)
    $angle =10*$strSize;
else if($strSize >=32 && $strSize <=36)
    $angle =10*$strSize-15;
else if($strSize >=37 && $strSize <38)
    $angle =10*$strSize-20;
else if($strSize >=38 && $strSize <39)
    $angle =10*$strSize-25;
else
    $angle =360;




//Managing Curve effect  
if(isset($_GET['font_width']) && isset($_GET['font_height'])){
  $fontWidth = explode(',',$_GET['font_width']);
  $fontHeight = explode(',',$_GET['font_height']);
  $oldWidth = $fontWidth[0];
  $newWidth = $fontWidth[1];
  $oldHeight = $fontHeight[0];
  $newHeight = $fontHeight[1];
  if($oldWidth > $newWidth || $oldHeight > $newHeight){
    // Decrease font size
    while($oldWidth > $newWidth){
      // echo("<br> Before image execute ".$oldWidth." > ".$newWidth. " dif =>  ". $oldWidth-$newWidth ."  | font => ". $font_size);
      if($oldWidth === (int)$newWidth){
          break;
      }else{
        if(($oldWidth-$newWidth) > 70){
            $font_size = $font_size-9;
        }else if(($oldWidth-$newWidth) > 40){
            $font_size = $font_size-6;
        }else if(($oldWidth-$newWidth) > 30){
            $font_size = $font_size-5;
        }else if(($oldWidth-$newWidth) > 20){
            $font_size = $font_size-3;
        }else if(($oldWidth-$newWidth) > 10){
            $font_size = $font_size-2;
        }else{
            $font_size = $font_size-1;
        }

        // $font_size--;
        $command = "sh texteffect -t \"$text\" -s outline -e arc-top -x 1 -a $angle -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        exec($command);
        // $commandTrim = "sh limitedtrim -t 9 -f 5 $output_file $output_file";
        // exec($commandTrim);
        $cwd = getcwd();
        $size = getimagesize("$cwd/$output_file");

        // echo "<br>Width->".$size[0];
        // echo "<br>Height->".$size[1];
        $oldWidth = $size[0];
        $oldHeight = $size[1];
        unlink("$cwd/$output_file");
        // echo("<br> After image ececute ".$oldWidth." < ".$newWidth."  | font => ". $font_size);
         // echo "<br>==================<br>";
      }
    }
  }
  else if($oldWidth < $newWidth){
    // Increase font size
    while($oldWidth < $newWidth){
      // echo("<br> Before image execute ".$oldWidth." < ".$newWidth. " dif =>  ". $newWidth-$oldWidth ."  | font => ". $font_size);
      if($oldWidth === (int)$newWidth){
          break;
      }else{
        if(($newWidth-$oldWidth) > 70){
            $font_size = $font_size+8;
        }else if(($newWidth-$oldWidth) > 50){
            $font_size = $font_size+5;
        }else if(($newWidth-$oldWidth) > 35){
            $font_size = $font_size+4;
        }else if(($newWidth-$oldWidth) > 20){
            $font_size = $font_size+3;
        }else if(($newWidth-$oldWidth) > 10){
            $font_size = $font_size+2;
        }else{
            $font_size = $font_size+1;
        }
        // $font_size = $font_size+2;
        $command = "sh texteffect -t \"$text\" -s outline -e arc-top -x 1 -a $angle -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        exec($command);
        // $commandTrim = "sh limitedtrim -t 9 -f 5 $output_file $output_file";
        // exec($commandTrim);
        $cwd = getcwd();
        $size = getimagesize("$cwd/$output_file");

        $oldWidth = $size[0];
        $oldHeight = $size[1];
        unlink("$cwd/$output_file");
        // echo("<br> After image ececute ".$oldWidth." < ".$newWidth."  | font => ". $font_size);
        // echo "<br>==================<br>";
      }
    }
  }
}
//Managing Curve effect
if($effect=="normal")
    $command = "sh texteffect -t \"$text\" -s outline -e normal -x 1 -d 0.5 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="pinch")
    $command = "sh texteffect -t \"$text\" -s outline -e pinch -d 0.5 -x 1 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="curve")
    $command = "sh texteffect -t \"$text\" -s outline -e arc-top -x 1 -a $angle -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="bridge")
    $command = "sh texteffect -t \"$text\" -s outline -e pinch-bottom -x 1 -d 0.5 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="arch")
    $command = "sh texteffect -t \"$text\" -s outline -e arch-top -x 1 -d 1.0 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="pointed")
    $command = "sh texteffect -t \"$text\" -s outline -e bulge-top -x 1 -d 1.0 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="valley")
    $command = "sh texteffect -t \"$text\" -s outline -e pinch-top -x 1 -d 0.5 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="bulge")
    $command = "sh texteffect -t \"$text\" -s outline -e bulge -x 1 -d 1.0 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="upward")
     $command = "sh texteffect -t \"$text\" -s outline -e wedge-top-left -x 1 -d 1.0 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
 else if($effect=="downward")
    $command = "sh texteffect -t \"$text\" -s outline -e wedge-bottom-left -x 1 -d 1.0 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="cone")
    $command = "sh texteffect -t \"$text\" -s outline -e wedge-left -x 1 -d 0.7 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="perspective")
    $command = "sh texteffect -t \"$text\" -s outline -e wedge-top-left -x 1 -d 0.5 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="wave-top")
    $command = "sh texteffect -t \"$text\" -s outline -e wave-top -d 0.5 -x 1 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
else if($effect=="wave-bottom")
    $command = "sh texteffect -t \"$text\" -s outline -e wave-bottom -x 1 -d 0.5 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";

// Execute the command
// die($command);
exec($command);
//Image triming 
// if($effect == 'curve'){
//     $commandTrim = "sh limitedtrim -t 9 -f 5 $output_file $output_file";
//     exec($commandTrim);
// }

$cwd = getcwd();
$size = getimagesize("$cwd/$output_file");

//Manageing canvas width
if(isset($_GET['canvas_width'])){
  $canvasWidth = $_GET['canvas_width'];
  $currentWidth = $size[0];
  if($currentWidth > $canvasWidth){
    while($currentWidth > $canvasWidth){
      // echo("<br> Before image ececute ".$currentWidth." > ".$canvasWidth."  | font => ". $font_size);
      if($currentWidth === (int)$canvasWidth){
          break;
      }else{
        unlink("$cwd/$output_file");
        if(($currentWidth-$canvasWidth) > 70){
          $font_size = $font_size-9;
        }else if(($currentWidth-$canvasWidth) > 40){
            $font_size = $font_size-6;
        }else if(($currentWidth-$canvasWidth) > 30){
            $font_size = $font_size-5;
        }else if(($currentWidth-$canvasWidth) > 20){
            $font_size = $font_size-3;
        }else if(($currentWidth-$canvasWidth) > 10){
            $font_size = $font_size-2;
        }else{
            $font_size = $font_size-1;
        }
        if($effect=="normal")
            $command = "sh texteffect -t \"$text\" -s outline -e normal -x 1 -d 0.5 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="pinch")
            $command = "sh texteffect -t \"$text\" -s outline -e pinch -d 0.5 -x 1 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="curve")
            $command = "sh texteffect -t \"$text\" -s outline -e arc-top -x 1 -a $angle -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="bridge")
            $command = "sh texteffect -t \"$text\" -s outline -e pinch-bottom -x 1 -d 0.5 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="arch")
            $command = "sh texteffect -t \"$text\" -s outline -e arch-top -x 1 -d 1.0 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="pointed")
            $command = "sh texteffect -t \"$text\" -s outline -e bulge-top -x 1 -d 1.0 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="valley")
            $command = "sh texteffect -t \"$text\" -s outline -e pinch-top -x 1 -d 0.5 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="bulge")
            $command = "sh texteffect -t \"$text\" -s outline -e bulge -x 1 -d 1.0 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="upward")
            $command = "sh texteffect -t \"$text\" -s outline -e wedge-top-left -x 1 -d 1.0 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="downward")
            $command = "sh texteffect -t \"$text\" -s outline -e wedge-bottom-left -x 1 -d 1.0 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="cone")
            $command = "sh texteffect -t \"$text\" -s outline -e wedge-left -x 1 -d 0.7 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="perspective")
            $command = "sh texteffect -t \"$text\" -s outline -e wedge-top-left -x 1 -d 0.5 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="wave-top")
            $command = "sh texteffect -t \"$text\" -s outline -e wave-top -d 0.5 -x 1 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        else if($effect=="wave-bottom")
            $command = "sh texteffect -t \"$text\" -s outline -e wave-bottom -x 1 -d 0.5 -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
            // $command = "sh texteffect -t \"$text\" -s outline -e arc-top -x 1 -a $angle -f $font_path -p $font_size -c '$text_color' -b transparent -o '$outline_color' -l $outline_width -u $background_color $output_file";
        exec($command);
        // $commandTrim = "sh limitedtrim -t 9 -f 5 $output_file $output_file";
        // exec($commandTrim);
        $cwd = getcwd();
        $size = getimagesize("$cwd/$output_file");
        $currentWidth = $size[0];
        // echo("<br> After image ececute ".$currentWidth." < ".$canvasWidth."  | font => ". $font_size);
        // echo "<br>==================<br>";

      }

    }

  }
}
// die();

//Manageing canvas width


//Image triming 

// $output = array();
// exec($command, $output, $return_var);

// // Print the output and return status
// echo "Command Output: " . implode("\n", $output) . "\n";
// echo "Return Status: " . $return_var . "\n";

// Get the current working directory


// Set the content type header
header('Content-Type: image/png');

// Send the image file as the API response
readfile("$cwd/$output_file");
$size = getimagesize("$cwd/$output_file");
header('x-img-height: '.$size[1]);
header('x-img-width: '.$size[0]);
header('x-font-size: '.$font_size);

// print_r($size);
// $fp = fopen("$cwd/$output_file", "rb");
// if ($size && $fp) {
//     header("Content-type: {$size['mime']}");
//     fpassthru($fp);
//     exit;
// } else {
//     // error
// }

// Delete the image file
unlink("$cwd/$output_file");
?>

