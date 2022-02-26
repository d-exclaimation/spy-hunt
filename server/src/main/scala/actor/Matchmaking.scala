//
//  Matchmaking.scala
//  spy-hunt
//
//  Created by d-exclaimation on 9:16 PM.
//

package actor

import akka.actor.typed.scaladsl.AskPattern._
import akka.actor.typed.scaladsl.Behaviors
import akka.actor.typed.{ActorRef, ActorSystem, Behavior}
import akka.util.Timeout
import socket.Client

import java.util.UUID
import scala.concurrent.duration.DurationInt
import scala.util.{Failure, Success}

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

  def apply(): Behavior[Act] = matchmaking(Map.empty)

  private def matchmaking(lobbies: Map[String, ActiveLobby]): Behavior[Act] = Behaviors.receive { (context, msg) =>
    implicit val sys: ActorSystem[Nothing] = context.system
    implicit val timeout: Timeout = Timeout(5.seconds)

    msg match {
      case Act.Enter(player) =>
        // Find available lobbies
        lobbies.find(_._2.isAvailable) match {
          case Some((id, ActiveLobby(ref, _))) =>

            // Distribute to the first available lobby
            ref ! Party.Act.Join(player)

            // Make sure the lobby status is in sync
            context.pipeToSelf(ref ? Party.Act.Status) {
              case Failure(e) =>
                println(e.getMessage)
                Act.Ignore

              case Success(value) =>
                Act.Update(id, value)
            }

            // Manual update will be confirmed with `Act.Update`
            matchmaking(
              lobbies.updated(id, ActiveLobby(ref, isAvailable = true))
            )

          case None =>

            // Make new lobby if all is full
            val id = UUID.randomUUID().toString
            val ref = context.spawn(Party(player), id)

            // Add this lobby
            matchmaking(
              lobbies.updated(id, ActiveLobby(ref, isAvailable = true))
            )
        }

      case Act.Quit(player) =>

        // Send a quit message all lobby
        // TODO(Optimization): Save the player id to lobby id, to do in O(1) time
        lobbies.values.foreach(_.ref ! Party.Act.Quit(player))
        Behaviors.same

      case Act.Update(id, isAvailable) =>
        matchmaking(
          lobbies
            // Find the lobby
            .get(id)
            // If exist, update into ActiveLobby with new status
            .map(lobby => ActiveLobby(lobby.ref, isAvailable))
            // If exist, update into lobbies
            .map(lobby => lobbies.updated(id, lobby))
            // else, just left lobbies unchanged
            .getOrElse(lobbies)
        )

      case Act.Ignore =>
        Behaviors.same
    }
  }
}