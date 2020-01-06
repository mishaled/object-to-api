import { JsonObject } from 'swagger-ui-express';

export const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const;

export type Method = typeof methods[number];

// export type MethodOverrides = { [paramKey: string]: MethodOverrides } | Method;
export type MethodOverrides<C> = C extends Function
    ? Method
    : C extends any
    ? { [K in keyof C]?: MethodOverrides<C[K]> }
    : never;

export default interface Options<T> {
    swagger?: true | JsonObject;
    methods?: MethodOverrides<T>;
}
