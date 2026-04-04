import type { RootState } from "../store";
import type { PeerState } from "../slices/peersSlice";

export const selectPeersMap = (state: RootState): Record<string, PeerState> =>
  state.peers.peers;

export const selectAllPeers = (state: RootState): PeerState[] =>
  Object.values(state.peers.peers);

export const selectPeerById =
  (socketId: string) =>
  (state: RootState): PeerState | undefined =>
    state.peers.peers[socketId];

export const selectPeerCount = (state: RootState): number =>
  Object.keys(state.peers.peers).length;
