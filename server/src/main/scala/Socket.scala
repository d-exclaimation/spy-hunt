//
//  Socket.scala
//  spy-hunt
//
//  Created by d-exclaimation on 1:59 PM.
//

import actor.gateway
import akka.http.scaladsl.model.ws.Message
import implicits.Services.system
import io.circe.generic.auto._
import model.TemplateResponse
import socket.{Client, Resp, TransportLayer}


object Socket extends TransportLayer {
  val protocol = "spyhunt-ws"

  def init(client: Client): Resp = {
    println(s"A client connected successfully with id of ${client.id}")

    system ! gateway.Msg.Join(client)

    Resp.reply(
      TemplateResponse("ok", "Hello from websocket")
    )
  }

  def message(_client: Client, msg: Message): Resp = {
    Resp.reply(
      TemplateResponse("ok", msg.toString)
    )
  }

  def terminate(client: Client): Resp = {
    println(s"A client disconnected with id of ${client.id}")
    Resp.ok()
  }
}

