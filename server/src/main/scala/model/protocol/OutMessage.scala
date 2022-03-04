//
//  OutMessage.scala
//  spy-hunt
//
//  Created by d-exclaimation on 3:18 PM.
//

package model.protocol

import io.circe.{Encoder, Json}
import model.Window

sealed trait OutMessage

object OutMessage {
  case class Update(state: Seq[Window.WithAgent], allies: Int, foes: Int, isTurn: Boolean) extends OutMessage

  case class Start(state: Seq[Window.WithAgent], allies: Int, foes: Int, isTurn: Boolean) extends OutMessage

  case class End(state: Seq[Window.WithAgent], win: Boolean, reason: String) extends OutMessage

  implicit val encoder: Encoder[OutMessage] = Encoder.instance {
    case Update(state, allies, foes, isTurn) =>
      Json.obj(
        "type" -> Json.fromString("update"),
        "payload" -> Json.obj(
          "state" -> Json.arr(state.map(_.json): _*),
          "allies" -> Json.fromInt(allies),
          "foes" -> Json.fromInt(foes),
          "isTurn" -> Json.fromBoolean(isTurn)
        )
      )
    case Start(state, allies, foes, isTurn) =>
      Json.obj(
        "type" -> Json.fromString("start"),
        "payload" -> Json.obj(
          "state" -> Json.arr(state.map(_.json): _*),
          "foes" -> Json.fromInt(foes),
          "allies" -> Json.fromInt(allies),
          "isTurn" -> Json.fromBoolean(isTurn)
        )
      )
    case End(state, win, reason) =>
      Json.obj(
        "type" -> Json.fromString("end"),
        "payload" -> Json.obj(
          "state" -> Json.arr(state.map(_.json): _*),
          "win" -> Json.fromBoolean(win),
          "reason" -> Json.fromString(reason)
        )
      )
  }

}