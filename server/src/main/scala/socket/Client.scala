//
//  Client.scala
//  spy-hunt
//
//  Created by d-exclaimation on 3:43 PM.
//


package socket

import akka.actor.typed.ActorRef
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import io.circe._
import io.circe.syntax._

case class Client(
  id: String,
  actorRef: ActorRef[Message]
) {
  def send(message: Message): Unit = {
    actorRef ! message
  }

  def sendJson[T](json: T)(implicit encoder: Encoder[T]): Unit = {
    actorRef ! TextMessage.Strict(json.asJson.noSpaces)
  }

  def close(): Unit = {
    actorRef ! TextMessage.Strict(Client.Acid)
  }
}

object Client {
  private val Acid = "<<websocket:stream:acid>>"

  def completionMatcher: PartialFunction[Message, Unit] = {
    case TextMessage.Strict(Acid) => ()
  }
}


