//
//  State.scala
//  spy-hunt
//
//  Created by d-exclaimation on 9:30 PM.
//


package actor.gateway

import socket.Client

case class State(
  lobbies: Seq[Seq[Client]]
)