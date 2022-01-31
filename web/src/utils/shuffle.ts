//
//  shuffle.ts
//  web
//
//  Created by d-exclaimation on 17:15.
//

export const shuffled = <T>(arr: Array<T>): Array<T> =>
  arr
    .map((each) => ({ value: each, sort: Math.random() }))
    .sort((lhs, rhs) => lhs.sort - rhs.sort)
    .map(({ value }) => value);
