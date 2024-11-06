import {ChangeDetectorRef, Injectable, NgZone} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {ImageStreamResult, PacketFormat} from "../../common/models/models";

@Injectable({
  providedIn: 'root',
})
export class ImageStreamService {
  eventSource: EventSource | null = null;

  constructor(private zone: NgZone) {
  }

  createEventSource(testNumber: number): EventSource {
    const url = `https://dev-file.maks.systems:8443/download/stream/sse/test?testNumber=${testNumber}`;
    return new EventSource(url);
  }

  fetchImageStream(testNumber: number): Observable<ImageStreamResult> {
    this.closeStream();
    const subject = new Subject<ImageStreamResult>();
    this.eventSource = this.createEventSource(testNumber);

    let totalSize = 0;
    const imageBuffer: Uint8Array[] = [];

    this.eventSource.onmessage = (event) => {
      this.zone.run(() => {
        const packet: PacketFormat = JSON.parse(event.data);
        const frameData = atob(packet.frameData);
        const frameBytes = new Uint8Array([...frameData].map(char => char.charCodeAt(0)));

        imageBuffer[packet.frameOffset] = frameBytes;
        totalSize += frameBytes.length;

        const combinedImage = new Uint8Array(totalSize);
        let currentIndex = 0;
        imageBuffer.forEach((byteArray) => {
          if (byteArray) {
            combinedImage.set(byteArray, currentIndex);
            currentIndex += byteArray.length;
          }
        });

        const blob = new Blob([combinedImage], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = () => {
          const result: ImageStreamResult = {
            url,
            width: img.width,
            height: img.height
          };
          subject.next(result);
        };
        img.src = url;
      });
    };

    this.eventSource.onerror = () => {
      this.zone.run(() => {
        subject.error(this.eventSource?.readyState);
        this.closeStream();
      });
    };

    return subject.asObservable();
  }

  closeStream() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
