//
//  InMessage.scala
//  spy-hunt
//
//  Created by d-exclaimation on 3:46 PM.
//

package model.protocol

import io.circe.{Decoder, DecodingFailure}

sealed trait InMessage

object InMessage {
  case class IndexedAction(action: String, index: Int) extends InMessage
  case class Action(action: String) extends InMessage

  implicit val decoder: Decoder[InMessage] = Decoder.instance {
    c =>
      c.downField("type").as[String]
        .flatMap {
          case typename@("shutter" | "next") =>
            Right(Action(typename))

          case typename@("lock" | "fire" | "call") => c
            .downField("payload")
            .downField("index")
            .as[Int]
            .map(IndexedAction(typename, _))

          case _ =>
            Left(DecodingFailure(
              message = "No matching type field",
              ops = List.empty
            ))
        }
  }
}
