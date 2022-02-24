//
//  Matchmaking.scala
//  spy-hunt
//
//  Created by d-exclaimation on 9:16 PM.
//

package actor

import akka.actor.typed.scaladsl.AskPattern._
import akka.actor.typed.scaladsl.{AbstractBehavior, ActorContext, Behaviors}
import akka.actor.typed.{ActorRef, ActorSystem, Behavior}
import akka.util.Timeout
import socket.Client

import java.util.UUID
import scala.collection.mutable
import scala.concurrent.duration.DurationInt
import scala.util.{Failure, Success}

final class Matchmaking(context: ActorContext[Matchmaking.Act]) extends AbstractBehavior[Matchmaking.Act](context) {

  import Matchmaking._

  implicit private val sys: ActorSystem[Nothing] = context.system
  implicit private val timeout: Timeout = Timeout(5.seconds)

  private val lobbies = mutable.Map.empty[String, ActiveLobby]

  def onMessage(msg: Matchmaking.Act): Matchmaking = receive(msg) {
    case Act.Enter(player) =>
      lobbies.find(_._2.isAvailable) match {
        case Some((id, ActiveLobby(ref, _))) =>
          ref ! Party.Act.Join(player)
          val future = ref ? Party.Act.Status
          context.pipeToSelf(future) {
            case Failure(e) =>
              println(e.getMessage)
              Act.Ignore

            case Success(value) =>
              Act.Update(id, value)
          }

        case None =>
          val id = UUID.randomUUID().toString
          val ref = context.spawn(Party(player), id)
          lobbies.update(id, ActiveLobby(ref, isAvailable = false))
      }

    case Act.Quit(player) =>
      lobbies.values.foreach(_.ref ! Party.Act.Quit(player))

    case Act.Update(id, isAvailable) =>
      lobbies
        .get(id)
        .map(lobby => ActiveLobby(lobby.ref, isAvailable))
        .foreach(lobby => lobbies.update(id, lobby))

    case Act.Ignore => ()
  }

  private def receive(msg: Act)(respond: Act => Unit): Matchmaking = {
    respond(msg)
    this
  }
}

object Matchmaking {
  sealed trait Act

  object Act {
    case class Enter(player: Client) extends Act

    case class Quit(player: Client) extends Act

    case object Ignore extends Act

    case class Update(id: String, isAvailable: Boolean) extends Act
  }


  case class ActiveLobby(
    ref: ActorRef[Party.Act],
    isAvailable: Boolean
  )


  def apply(): Behavior[Act] = Behaviors.setup(new Matchmaking(_))
}