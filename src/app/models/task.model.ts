export interface Task {
  id: number;
  name: string;
  description: string;
  creationDate: Date;
  modificationDate: Date;
  state: 'in queue' | 'in progress' | 'done' | string;
  userName: string | null;
}
