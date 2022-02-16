//
//  match.ts
//  web
//
//  Created by d-exclaimation on 18:13.
//

export const match = <Key extends string, Return = void>(
  key: Key,
  matcher: Record<Key, () => Return>
): Return => {
  const action = matcher[key];

  if (!action)
    throw new Error("Unmatched clause occurred, check for exhausiveness");

  return action();
};
