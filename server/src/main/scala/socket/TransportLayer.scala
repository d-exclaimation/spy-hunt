//
//  WebSocketHandler.scala
//  spy-hunt
//
//  Created by d-exclaimation on 6:52 PM.
//


package socket

import akka.NotUsed
import akka.http.scaladsl.model.ws.Message
import akka.http.scaladsl.server.Directives.handleWebSocketMessagesForProtocol
import akka.http.scaladsl.server.Route
import akka.stream.OverflowStrategy
import akka.stream.scaladsl.{Flow, Keep, Sink, Source}
import akka.stream.typed.scaladsl.ActorSource
import implicits.Services._
import implicits.StreamExtensions._

import java.util.UUID

/**
 * Websocket TransportLayer trait
 */
trait TransportLayer {
  /** Websocket sub-protocol for `sec-websocket-protocol` */
  def protocol: String

  /**
   * Websocket handler
   *
   * @return a Akka HTTP route
   */
  def applyMiddleware(): Route = {
    handleWebSocketMessagesForProtocol(flow(), protocol)
  }

  /**
   * Flow stream for the Websocket handler
   *
   * @return a Flow with Message as input and TextMessage as output
   */
  private def flow(): Flow[Message, Message, _] = {
    val id = UUID.randomUUID().toString

    val (actorRef, publisher) = ActorSource
      .actorRef[Message](
        completionMatcher = Client.completionMatcher,
        failureMatcher = PartialFunction.empty,
        bufferSize = 64,
        overflowStrategy = OverflowStrategy.dropHead
      )
      .toMat(Sink.asPublisher(false))(Keep.both)
      .run()

    val client = Client(id, actorRef)

    // Initial WebSocket callback
    val resp = init(client)
    handle(client, resp)

    // Termination and Message callback
    val sink: Sink[Message, NotUsed] = Sink
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

  /**
   * Initial callback after a client is initialized
   *
   * @param client Websocket client
   * @return a Response for the client
   */
  def init(client: Client): Resp

  /**
   * Incoming message callback
   *
   * @param client Websocket client
   * @param msg    Incoming websocket message
   * @return
   */
  def message(client: Client, msg: Message): Resp

  /**
   * Termination callback
   *
   * @param client Websocket client
   * @return a Response
   */
  def terminate(client: Client): Resp

  /**
   * Handle responses after being processed
   *
   * @param client Websocket client
   * @param resp   Processed response
   */
  private def handle(client: Client, resp: => Resp): Unit = resp match {
    case Resp.Reply(message) => client.send(message)
    case Resp.Stop => client.close()
    case Resp.Ok => ()
  }
}

