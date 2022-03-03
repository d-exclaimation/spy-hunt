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
import model.protocol.InMessage
import socket.Client

import java.util.UUID
import scala.concurrent.duration.DurationInt
import scala.util.{Failure, Success}

object Matchmaking {
  sealed trait Act

  object Act {
    case class Enter(player: Client) extends Act

    case class Quit(player: Client) extends Act

    case class Incoming(player: Client, in: InMessage) extends Act

    case object Ignore extends Act

    case class Update(id: String, isAvailable: Boolean) extends Act
  }


  case class ActiveLobby(
    ref: ActorRef[Party.Act],
    isAvailable: Boolean
  )

  def apply(): Behavior[Act] = matchmaking(Map.empty, Map.empty)

  private def matchmaking(
    lobbies: Map[String, ActiveLobby],
    players: Map[String, String]
  ): Behavior[Act] = Behaviors.receive { (context, msg) =>
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
              lobbies.updated(id, ActiveLobby(ref, isAvailable = true)),
              players.updated(player.id, id)
            )

          case None =>

            // Make new lobby if all is full
            val id = UUID.randomUUID().toString
            val ref = context.spawn(Party(player), id)

            // Add this lobby
            matchmaking(
              lobbies.updated(id, ActiveLobby(ref, isAvailable = true)),
              players.updated(player.id, id)
            )
        }

      case Act.Incoming(player, inMessage) =>
        players
          .get(player.id)
          .flatMap(lobbies.get)
          .foreach(_.ref ! Party.Act.Incoming(player, inMessage))
        Behaviors.same

      case Act.Quit(player) =>

        // Send a quit message the proper lobby
        val newLobbies = players
          .get(player.id)
          .map{ id =>
            lobbies.get(id).foreach(_.ref ! Party.Act.Quit(player))
            lobbies.removed(id)
          }
          .getOrElse(lobbies)

        matchmaking(
          newLobbies,
          players.removed(player.id)
        )

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
            .getOrElse(lobbies),
          players,
        )

      case Act.Ignore =>
        Behaviors.same
    }
  }
}