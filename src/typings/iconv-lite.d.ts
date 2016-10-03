declare module IconvLite {
  export function decode(buf: Buffer, type: string): string
}


declare module 'iconv-lite' {
  export =IconvLite
}