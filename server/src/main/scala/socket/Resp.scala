//
//  Resp.scala
//  spy-hunt
//
//  Created by d-exclaimation on 7:04 PM.
//

package socket

import akka.http.scaladsl.model.ws.{BinaryMessage, Message, TextMessage}
import akka.util.ByteString
import io.circe.syntax._

sealed trait Resp

object Resp {
  case class Reply(message: Message) extends Resp

  case object Ok extends Resp

  case object Stop extends Resp

  def reply(message: String): Reply =
    Reply(TextMessage.Strict(message))

  def reply[T](json: T)(implicit encoder: io.circe.Encoder[T]): Reply = {
    val message = json.asJson.noSpaces
    Reply(TextMessage.Strict(message))
  }

  def reply(binary: ByteString): Reply =
    Reply(BinaryMessage.Strict(binary))


  def ok() = Ok

  def stop() = Stop
}