function signalHandler(data, socket) {
  const { connUserSocketId, signal } = data;
  const newSignalingData = { signal: signal, connUserSocketId: socket.id }; //socket id need to change as attendee's, this data will return to new comer?
  io.to(connUserSocketId).emit("connectSignal", newSignalingData);
}

module.exports = { signalHandler };
