//
//  Resp.scala
//  spy-hunt
//
//  Created by d-exclaimation on 7:04 PM.
//

package socket

import io.circe.syntax._

sealed trait Resp

object Resp {
  case class Reply(message: String) extends Resp

  case object Ok extends Resp

  case object Stop extends Resp

  def reply(message: String): Reply =
    Reply(message)

  def reply[T](json: T)(implicit encoder: io.circe.Encoder[T]): Reply = {
    val message = json.asJson.noSpaces
    Reply(message)
  }

  def ok() = Ok

  def stop() = Stop
}