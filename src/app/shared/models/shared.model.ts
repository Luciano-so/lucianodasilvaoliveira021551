export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

export interface LoadingState {
  show: boolean;
  message?: string;
}
