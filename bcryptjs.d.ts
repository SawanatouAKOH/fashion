declare module "bcryptjs" {
  export function hash(value: string, saltOrRounds: string | number): Promise<string>;
  export function compare(value: string, encrypted: string): Promise<boolean>;
  export function genSalt(rounds?: number): Promise<string>;
}
