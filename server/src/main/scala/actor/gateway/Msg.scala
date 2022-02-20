//
//  Msg.scala
//  spy-hunt
//
//  Created by d-exclaimation on 9:30 PM.
//


package actor.gateway

import socket.Client

sealed trait Msg

object Msg {
  case class Join(client: Client) extends Msg

  case object Test extends Msg
}
