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
}

export interface ProgressInfo {
  percent: number;
  transferred: number;
  total: number;
  speed?: number;
}
