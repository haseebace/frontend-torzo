// Shared TorBox API types used by both server proxy and client components

export interface TorBoxResponse<T> {
  success: boolean;
  error: string | null;
  detail: string;
  data: T;
}

export interface TorBoxFile {
  id: number;
  md5: string;
  hash: string;
  name: string;
  size: number;
  zipped: boolean;
  s3_path: string;
  infected: boolean;
  mimetype: string;
  short_name: string;
  absolute_path: string;
  opensubtitles_hash: string;
}

export interface TorBoxTorrent {
  id: number;
  auth_id: string;
  server: number;
  hash: string;
  name: string;
  magnet: string;
  size: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  download_state: string;
  seeds: number;
  peers: number;
  ratio: number;
  progress: number;
  download_speed: number;
  upload_speed: number;
  eta: number;
  torrent_file: boolean;
  expires_at: string;
  download_present: boolean;
  files: TorBoxFile[];
  download_path: string;
  availability: number;
  download_finished: boolean;
  tracker: string;
  total_uploaded: number;
  total_downloaded: number;
  cached: boolean;
  owner: string;
  seed_torrent: boolean;
  allow_zipped: boolean;
  long_term_seeding: boolean;
  tracker_message: string;
  cached_at: string;
  private: boolean;
  alternative_hashes: string[];
  tags: string[];
}

export interface TorBoxCreateTorrentResponse {
  hash: string;
  torrent_id: number;
  auth_id: string;
}

export interface TorBoxCachedInfo {
  name: string;
  size: number;
  hash: string;
  files: Array<{
    id: number;
    name: string;
    size: number;
    opensubtitles_hash: string;
    short_name: string;
    mimetype: string;
  }>;
}

export type TorBoxCachedResult = Record<string, TorBoxCachedInfo>;

export interface TorBoxUser {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
  auth_id: string;
  user_type: string;
  premium: number;
  expires_at: string;
  cooldown_until: string;
  server: number;
  is_subscribed: boolean;
  plan: string;
}
