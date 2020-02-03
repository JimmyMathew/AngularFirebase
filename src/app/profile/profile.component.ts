import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {AngularFirestoreDocument,AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { UserProfile } from '../core/user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { auth } from 'firebase';
import { AuthService } from '../core/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
private itemDoc: AngularFirestoreDocument<UserProfile>;
item: Observable<UserProfile>;
uid:string;
loading = false;
error: string;
downloadURL: Observable<string>;
uploadProgress:Observable<number>;  

constructor(private afAuth:AngularFireAuth,
    private afs: AngularFirestore, 
    private route: ActivatedRoute,
    private auth: AuthService,
    private afStorage: AngularFireStorage
    ) { 
    this.uid = route.snapshot.paramMap.get('id');
    this.downloadURL = this.afStorage.ref(`users/${this.uid}/profile-image`).getDownloadURL();
  }

  ngOnInit() {
    this.itemDoc = this.afs.doc<UserProfile>(`users/${this.uid}`)
    this.item = this.itemDoc.valueChanges();
  }

  async onSubmit(ngForm: NgForm){
  this.loading = true;
  const {
    email,
    name,
    address,
    city,
    state,
    zip,
    phone,
    specialty,
    ip
  } = ngForm.form.getRawValue();
  const UserProfile: UserProfile = {
    uid: this.uid,
    email,
    name,
    address,
    city,
    state,
    zip,
    phone,
    specialty,
    ip
  };
  try {
    await this.auth.updateUserDocument(UserProfile);
  } catch (error) {
    console.log(error.message);
    this.error = error.message;
  }
  this.loading = false;
  }
  fileChange(event){
    this.downloadURL = null;
    this.error = null;
    
    //get the error
    const file = event.target.files[0];

    //create the file reference 
    const filePath = `users/${this.uid}/profile-image`;
    const fileRef = this.afStorage.ref(filePath);

    //Upload and store the task 
    const task = this.afStorage.upload(filePath,file);
    task.catch(error => this.error = error.message);

    //Observer percentage changes 
    this.uploadProgress = task.percentageChanges();

    //get notified when the download url is available 
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
        })
        )
        .subscribe();
  }
}
