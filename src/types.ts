export interface VideoInfo {
  title: string;
  author: string;
  duration: string;
  views?: number;
  uploadDate?: string;
  description?: string;
  videoId: string;
}

export interface DownloadOptions {
  outputDir: string;
  format: string;
  quality: string;
  audioOnly?: boolean;
  videoInfo: VideoInfo;
  transcriptOnly?: boolean;
  includeTranscript?: boolean;
}

export interface ProgressInfo {
  percent: number;
  transferred: number;
  total: number;
  speed?: number;
}

export interface SubtitleTrack {
  languageCode: string;
  languageName: string;
  isAutomatic: boolean;
  url: string;
}
