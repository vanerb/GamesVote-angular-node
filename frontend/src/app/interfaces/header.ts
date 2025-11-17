export interface HeaderItem {
  key: string;
  name: string;
  position: 'left' | 'right';
  action?: () => Promise<void>;
  children?: HeaderItem[];
}
