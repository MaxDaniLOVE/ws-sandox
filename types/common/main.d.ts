declare module 'mongoose-gridfs' {
  export function createModel({ modelName: string }): {
    read(never, callback: (error: any, file: any) => any): Stream;
    write(options: any, readStream: Stream, callback: (error: any, file: any) => any): void;
    unlink(options: any, callback: (error: any, file: any) => any): void;
  };
}