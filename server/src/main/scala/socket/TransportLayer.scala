//
//  WebSocketHandler.scala
//  spy-hunt
//
//  Created by d-exclaimation on 6:52 PM.
//


package socket

import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.server.Directives.handleWebSocketMessagesForProtocol
import akka.http.scaladsl.server.Route
import akka.stream.OverflowStrategy
import akka.stream.scaladsl.{Flow, Keep, Sink, Source}
import akka.stream.typed.scaladsl.ActorSource
import implicits.Global._
import implicits.StreamExtensions._

import java.util.UUID

trait TransportLayer {
  def protocol: String

  def ws(): Route = {
    handleWebSocketMessagesForProtocol(flow(), protocol)
  }

  private def flow(): Flow[Message, TextMessage.Strict, _] = {
    val id = UUID.randomUUID().toString

    val (actorRef, publisher) = ActorSource
      .actorRef[String](
        completionMatcher = Client.completionMatcher,
        failureMatcher = PartialFunction.empty,
        bufferSize = 64,
        overflowStrategy = OverflowStrategy.dropHead
      )
      .map(TextMessage.Strict)
      .toMat(Sink.asPublisher(false))(Keep.both)
      .run()

    val client = Client(id, actorRef)

    // Initial WebSocket callback
    val resp = init(client)
    handle(client, resp)

    // Termination and Message callback
    val sink: Sink[Message, Any] = Sink
      .onComplete[Unit] { _ =>
        val resp = terminate(client)
        handle(client, resp)
      }
      .withBefore { msg =>
        val resp = message(client, msg)
        handle(client, resp)
      }

    val source = Source
      .fromPublisher(publisher)

    Flow
      .fromSinkAndSourceCoupled(sink, source)
  }

  def init(client: Client): Resp

  def message(client: Client, msg: Message): Resp

  def terminate(client: Client): Resp

  private def handle(client: Client, resp: => Resp): Unit = resp match {
    case Resp.Reply(message) => client.send(message)
    case Resp.Stop => client.close()
    case Resp.Ok => ()
  }
}

