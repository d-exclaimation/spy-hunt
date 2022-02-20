//
//  Client.scala
//  spy-hunt
//
//  Created by d-exclaimation on 3:43 PM.
//


package socket

import akka.actor.typed.ActorRef

case class Client(
  id: String,
  actorRef: ActorRef[String]
) {
  def send(message: String): Unit = {
    actorRef ! message
  }

  def close(): Unit = {
    actorRef ! Client.acid
  }
}

object Client {
  private val acid = "<<websocket:stream:acid>>"

  def completionMatcher: PartialFunction[String, Unit] = {
    case Client.`acid` => ()
  }
}


