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

/**
 * Websocket responses
 */
sealed trait Resp

object Resp {
  /**
   * Reply response
   *
   * @param message Websocket message
   */
  case class Reply(message: Message) extends Resp

  /**
   * No reply and continue response
   */
  case object Ok extends Resp

  /**
   * No reply and stop response
   */
  case object Stop extends Resp

  /**
   * Reply response
   *
   * @param message String message
   */
  def reply(message: String): Reply =
    Reply(TextMessage.Strict(message))

  /**
   * Reply response
   *
   * @param json Object (JSON Encodable) message
   */
  def reply[T](json: T)(implicit encoder: io.circe.Encoder[T]): Reply = {
    val message = json.asJson.noSpaces
    Reply(TextMessage.Strict(message))
  }

  /**
   * Reply response
   *
   * @param binary ByteString message
   */
  def reply(binary: ByteString): Reply =
    Reply(BinaryMessage.Strict(binary))

  /**
   * No reply and continue response
   */
  def ok() = Ok

  /**
   * No reply and stop response
   */
  def stop() = Stop
}