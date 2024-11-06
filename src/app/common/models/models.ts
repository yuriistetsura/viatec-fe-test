export interface PacketFormat {
  pictureSize: number;
  frameOffset: number;
  frameData: string;
}

export interface ImageStreamResult {
  url: string;
  width: number;
  height: number;
}
