const streams = new Map<string, MediaStream>();

export function setStream(socketId: string, stream: MediaStream): void {
  streams.set(socketId, stream);
}

export function getStream(socketId: string): MediaStream | undefined {
  return streams.get(socketId);
}

export function removeStream(socketId: string): void {
  const stream = streams.get(socketId);
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    streams.delete(socketId);
  }
}

export function getAllStreams(): Map<string, MediaStream> {
  return streams;
}
