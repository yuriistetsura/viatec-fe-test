import {Component, ElementRef, inject, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {
  MatSnackBar,
  MatSnackBarModule,
} from "@angular/material/snack-bar";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ImageStreamService} from "../../services/image-stream/image-stream.service";
import {ImageStreamResult} from "../../common/models/models";
import {CommonModule} from "@angular/common";
import {SnackBarMessages, StreamReadyState} from "../../common/enums/enums";
import {Subscription} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-image-stream-form',
  standalone: true,
  imports: [
    FormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSnackBarModule, MatProgressSpinner
  ],
  templateUrl: './image-stream-form.component.html',
  styleUrl: './image-stream-form.component.scss',
})
export class ImageStreamFormComponent implements OnDestroy {
  private snackBar = inject(MatSnackBar);

  testNumber: number | null = null;
  imageData: string | null = null;
  imageWidth = 0;
  imageHeight = 0;
  imageStreamSubscription: Subscription | null = null;
  isLoading = false;

  constructor(private imageStreamService: ImageStreamService) {
  }

  onSubmit() {
    if (this.testNumber) {
      this.fetchImageStream(this.testNumber);
    }
  }

  fetchImageStream(testNumber: number) {
    if (this.imageStreamSubscription) {
      this.imageStreamSubscription.unsubscribe();
    }

    this.imageStreamSubscription = this.imageStreamService.fetchImageStream(testNumber).subscribe({
      next: (result: ImageStreamResult) => {
        this.isLoading = true;
        this.imageData = result.url;
        this.imageWidth = result.width;
        this.imageHeight = result.height;
      },
      error: (err: number) => {
        if (err === StreamReadyState.finish) {
          this.openSnackBar(SnackBarMessages.imgSuccessUploaded);
        } else {
          this.openSnackBar(SnackBarMessages.imgNotFound);
        }
        this.isLoading = false;
      },
    });
  }

  openSnackBar(message: SnackBarMessages) {
    this.snackBar.open(message, 'Close', { duration: 2000 });
  }

  ngOnDestroy() {
    this.imageStreamSubscription?.unsubscribe();
  }
}
