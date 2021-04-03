declare module 'mongoose-gridfs' {
  export function createModel({ modelName: string }): {
    read(never): Stream;
    write(options: any, readStream: Stream, callback: (error: any, file: any) => any): void;
  };
}