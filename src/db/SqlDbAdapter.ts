export interface SqlDbAdapter {
  query: (text: string, params?: any[], callback?: any) => Promise<any[]>;
  shutdown: () => Promise<void>;
  connect: () => Promise<any>;
}
