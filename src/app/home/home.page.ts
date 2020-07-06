import { Component } from '@angular/core';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController } from '@ionic/angular';
import { FileEncryption } from '@ionic-native/file-encryption/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tituloLivros: ["Minimos Contos","Dom Casmurro","Robson Crusoé"]
  key: any = 'senhaarvore';
  fileTransfer: FileTransferObject;
  uploadText: any;
  downlaodText: any;
  constructor(private transfer: FileTransfer,private fileEncryption: FileEncryption,  private alertController: AlertController,
    private file: File, private filePath: FilePath, private fileChooser: FileChooser) {
      this.uploadText = "";
      this.downlaodText = "";
      console.log(this.encrypt())
  }
  

  encrypt() {
    var file = '9788565126014.pdf';
    this.fileEncryption.encrypt(file, 'secretKey').then(data=>{
      return data;
    })
  }

  async baixar() {
    const alert = this.alertController.create({message: 'Arquivo encriptado baixado, transfira por bluetooth e faça o upload no app.',buttons: ['OK']});
    (await alert).present();
  }

  async upload() {
    this.fileChooser.open().then((uri) =>{
      this.filePath.resolveNativePath(uri).then((nativePath) => {
        this.fileTransfer = this.transfer.create();
        let options:FileUploadOptions = {
          fileKey: 'book',
          fileName: 'name.pdf',
          chunkedMode: false,
          headers: {},
          mimeType: 'book/pdf'
        }
        alert("Arquivo recebido")
        this.uploadText = "enviando...";
        this.fileTransfer.upload(nativePath,'/home',options).then((data)=>{
          alert("transfer done = " + JSON.stringify(data));
          this.uploadText = "";
        },(err)=>{
          this.uploadText = "";
        })
      },(err)=>{
        alert(JSON.stringify(err));
      })
    },(err)=> {
      alert(JSON.stringify(err));
    })
  }

  abortUpload(){
    this.fileTransfer.abort();
    alert("upload cancel.");
  }

  async download(){
    this.fileTransfer = this.transfer.create();
    this.downlaodText = "downloading...";
    let url = encodeURI('9788565126014.pdf');  
    alert("Livro baixado");
    console.log(url)
    this.fileTransfer.download(url,this.file.externalRootDirectory).then((data)=>{
      console.log("Data:" + data)
      alert("download complete");
      this.downlaodText ="";
    },(err)=>{
      console.log(err);
    })
  }
}
