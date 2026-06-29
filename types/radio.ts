import { RadioStation } from "@/constants/radioStationsData";

export interface RadioPlayerState {
  isPlaying: boolean;
  currentStation: RadioStation | null;
  isConnecting: boolean;
  error: string | null;
  isMuted: boolean;
}

export interface RadioPlayerContextType extends RadioPlayerState {
  playStation: (station: RadioStation) => void;
  togglePlayPause: () => void;
  stop: () => void;
  toggleMute: () => void;
  setStation: (station: RadioStation) => void;
  favoriteStations: string[];
  toggleFavorite: (station: RadioStation) => void;
  isFavorite: (station: RadioStation) => boolean;
}
