<?php 
namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Intl\Intl;
use Symfony\Component\String\Slugger\SluggerInterface;

class FilesUtils{

    private  $targetPath;
    private $file;
    private $originalFileName;
    private $data;
   
     
     
     /**
     * @param object $data ,file object from form
     * @param string $targetPath path to store uploaded files
     */
    public function __construct($data=null,$targetPath=null){

        $this->data = $data;
        $this->targetPath = $targetPath;
    }

    // public function is_file_exist(){
    //     $fileIsExist= file_exists($this->img);
    //     return $fileIsExist;
    // }

    // public function canUpload(){
    //     $fileSize= $_FILES[$this->idInput]["size"];
    //     return $fileSize <= 15000000;
        
    // }

    /**
     * this function help us to upload file
     * @return string return new file name
     */
    public function upload(SluggerInterface $slugger){
       
        $this->file=$this->data;
        $newFilename=null;
        if(!is_null($this->file)){
            $this->originalFileName= pathinfo($this->file->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($this->originalFileName);
            $newFilename = $safeFilename . '-' . uniqid() . '.' .  $this->file->guessExtension();
            try {
                $this->file->move($this->targetPath,$newFilename);
            } catch (FileException $e) {
                // ... handle exception if something happens during file upload
            }
        }
        
        return  $newFilename;
    }

    public function validFileFormat(){    
        $imageFileType= strtolower(pathinfo($this->targetPath . $this->img, PATHINFO_EXTENSION));
        return ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif");
    }

    /**
     * this function help to upload a file from fetch/ajax 
     * @param string $path: directory where to save file
     * @param string $image: base 64
     * @param string $image_name
     * @return void
     */
    public function uploadImageAjax($path,$image, $image_name){

        file_put_contents($path . $image_name, file_get_contents($image));
    }


}
