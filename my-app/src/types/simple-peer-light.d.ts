declare module "simple-peer-light" {
  import { Duplex } from "stream";

  interface Options {
    initiator?: boolean;
    channelConfig?: RTCDataChannelInit;
    channelName?: string;
    config?: RTCConfiguration;
    offerOptions?: RTCOfferOptions;
    answerOptions?: RTCAnswerOptions;
    sdpTransform?: (sdp: string) => string;
    stream?: MediaStream;
    streams?: MediaStream[];
    trickle?: boolean;
    allowHalfTrickle?: boolean;
    wrtc?: object;
    objectMode?: boolean;
  }

  class Peer extends Duplex {
    constructor(opts?: Options);

    signal(data: unknown): void;
    send(data: string | Uint8Array | ArrayBuffer): void;
    addStream(stream: MediaStream): void;
    removeStream(stream: MediaStream): void;
    addTrack(track: MediaStreamTrack, stream: MediaStream): void;
    removeTrack(track: MediaStreamTrack, stream: MediaStream): void;
    replaceTrack(
      oldTrack: MediaStreamTrack,
      newTrack: MediaStreamTrack,
      stream: MediaStream
    ): void;
    negotiate(): void;
    destroy(err?: Error): void;

    readonly streams: MediaStream[];
    readonly connected: boolean;
    readonly destroyed: boolean;

    on(event: "signal", listener: (data: unknown) => void): this;
    on(event: "connect", listener: () => void): this;
    on(event: "data", listener: (data: Uint8Array) => void): this;
    on(event: "stream", listener: (stream: MediaStream) => void): this;
    on(event: "track", listener: (track: MediaStreamTrack, stream: MediaStream) => void): this;
    on(event: "close", listener: () => void): this;
    on(event: "error", listener: (err: { error: Error }) => void): this;
    on(event: string, listener: (...args: unknown[]) => void): this;
  }

  export = Peer;
}
