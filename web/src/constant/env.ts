//
//  env.ts
//  web
//
//  Created by d-exclaimation on 21:16.
//

export const __WS__ =
  import.meta.env.WS?.toString() || "ws://localhost:4000/ws";
