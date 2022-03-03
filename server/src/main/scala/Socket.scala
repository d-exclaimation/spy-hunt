//
//  Socket.scala
//  spy-hunt
//
//  Created by d-exclaimation on 1:59 PM.
//

import actor.Matchmaking.Act
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import implicits.Services.system
import io.circe.DecodingFailure
import io.circe.generic.auto._
import io.circe.parser._
import model.TemplateResponse
import model.protocol.InMessage
import socket.{Client, Resp, TransportLayer}


object Socket extends TransportLayer {
  val protocol = "spyhunt-ws"

  def init(client: Client): Resp = {
    println(s"A client connected successfully with id of ${client.id}")

    system ! Act.Enter(client)

    Resp.ok()
  }

  def message(client: Client, msg: Message): Resp = {
    translate(msg)
      .map { msg =>
        system ! Act.Incoming(client, msg)
      }
      .map(_ => Resp.ok())
      .getOrElse(Resp.stop())
  }

  def terminate(client: Client): Resp = {
    println(s"A client disconnected with id of ${client.id}")

    system ! Act.Quit(client)

    Resp.ok()
  }

  def translate(msg: Message): Either[io.circe.Error, InMessage] = msg match {
    case TextMessage.Strict(json) => decode[InMessage](json)
    case _ => Left(DecodingFailure(
      message = "Not a strict websocket text message",
      ops = List.empty
    )
    )
  }
}

