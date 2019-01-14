declare module "express-static-gzip" {
  interface IcompressionOptions {
    encodingName: string;
    fileExtension: string;
  }

  interface Ioptions {
    enableBrotli?: boolean;
    customCompressions?: IcompressionOptions[];
    orderPreference?: string[];
    index?: boolean
  }

  function expressStaticGzip(rootFolder: string, options?: Ioptions): any;
  export = expressStaticGzip;
}
