import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FILE_TYPES } from 'src/app/Constants';

import { FileModule } from 'src/app/modules/file/file.module';
import { FileService } from 'src/app/services/file.service';

import { FileCardComponent } from '../file-card/file-card.component';

@Component({
  selector: 'app-file-lists',
  templateUrl: './file-lists.component.html',
  styleUrls: ['./file-lists.component.css']
})


export class FileListsComponent implements OnInit {
  files: FileModule[] = [];

  // name=this.file.extension;

  pageSize = 0;
  perPage = 6;
  p: number = 1;
  name = '';
  size = '';
  extension = '';
  folderName = '';
  id = '';

  types: any = {
    png: {

      icon: 'fa fa-light fa-image text-info',
      class: 'info'
    },
    pdf: {

      icon: 'fa fa-file-pdf-o text-danger',
      class: 'danger'
    },
    csv: {

      icon: 'fa fa-file-excel-o text-success',
      class: 'success'
    },
    txt: {

      icon: 'fa fa-file-text-o text-secondary',
      class: 'gold'
    },
    pptx: {

      icon: 'fa fa-file-powerpoint-o text-warning',
      class: 'warning'
    }
    ,
    mp4: {

      icon: 'fa fa-file-video-o text-dark',
      class: 'dark'
    }

    ,
    rar: {

      icon: 'fa fa-file-video-o text-dark',
      class: 'dark'
    }


  }



  file: FileModule = new FileModule();

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';




  constructor(private fileSrvice: FileService,
    private router: Router) { }


  ngOnInit(): void {
    this.getFiles();

  }



  private getFiles() {
    this.fileSrvice.getFiles().subscribe(data => {
      this.files = data;
      console.log("data ", this.files)
    });
  }

  deleteFile(id: string) {
    this.fileSrvice.deleteFile(id).subscribe(data => {
      console.log(data);
      this.getFiles();
    })
  }



















  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.fileSrvice.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;

            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }


}


