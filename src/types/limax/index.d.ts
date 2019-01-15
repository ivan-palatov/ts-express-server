declare module "limax" {
  interface Icustom {
    [x: string]: string;
  }

  interface Iopt {
    replacement?: string;
    separator?: string;
    lang?: string;
    tone?: boolean;
    separateNumbers?: boolean;
    maintainCase?: boolean;
    custom?: string[] | Icustom;
  }

  function slug(text: string, opt?: Iopt): string;
  export = slug;
}
