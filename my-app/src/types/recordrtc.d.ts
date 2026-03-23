declare module "recordrtc" {
  class RecordRTC {
    constructor(stream: MediaStream, options?: Record<string, unknown>);
    startRecording(): void;
    stopRecording(callback?: () => void): void;
    getBlob(): Promise<Blob>;
    destroy(): void;
    static StereoAudioRecorder: unknown;
  }

  export = RecordRTC;
}
