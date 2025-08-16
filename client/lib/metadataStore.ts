import { create } from "zustand";

export type MetadataType = {
  no_speech_prob: number;
  avg_logprob: number;
  compression_ratio: number;
  count: number;
};

type MetadataStoreType = {
  setMetadataData: (data: MetadataType) => void;
} & MetadataType;

export const useMetadataStore = create<MetadataStoreType>((set) => ({
  no_speech_prob: 0,
  avg_logprob: 0,
  compression_ratio: 0,
  count: 0,
  setMetadataData: (data: MetadataType) =>
    set((state) => ({
      no_speech_prob: state.no_speech_prob + data.no_speech_prob,
      avg_logprob: state.avg_logprob + data.avg_logprob,
      compression_ratio: state.compression_ratio + data.compression_ratio,
      count: state.count + data.count,
    })),
}));
