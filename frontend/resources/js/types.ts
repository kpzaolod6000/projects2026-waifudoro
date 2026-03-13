export interface UserProfile {
  name: string;
  level: number;
  xpCurrent: number;
  xpNext: number;
  avatarUrl: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export interface Task {
  id: number;
  title: string;
  tags: string[];
  time: string;
  completed: boolean;
}

export interface StatInfo {
  id: string;
  label: string;
  value: string;
  icon: string;
  colorClass: string;
}

export interface WaifuStatus {
  happiness: number;
  energy: number;
  message: string;
  imageUrl: string;
  streak: number;
}
