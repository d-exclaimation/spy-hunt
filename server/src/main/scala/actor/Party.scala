//
//  Party.scala
//  spy-hunt
//
//  Created by d-exclaimation on 11:43 PM.
//

package actor

import actor.lobby.Msg
import actor.utils.AskPattern.reply
import akka.actor.typed.{ActorRef, Behavior}
import akka.actor.typed.scaladsl.Behaviors
import socket.Client

object Party {
  sealed trait Act

  object Act {
    case class Join(player2: Client) extends Act

    case class Status(ref: ActorRef[Boolean]) extends Act

    case class Quit(player: Client) extends Act
  }

  sealed trait Players {
    def isFull: Boolean

    def all: Seq[Client]
  }

  object Players {
    case class Waiting(player1: Client) extends Players {
      val isFull = false

      def all = Seq(player1)
    }
    case class Full(player1: Client, player2: Client) extends Players {
      val isFull = true

      def all = Seq(player1, player2)
    }
  }

  def apply(client: Client): Behavior[Act] =
    party(Players.Waiting(client))

  private def party(players: Players): Behavior[Act] = Behaviors.receive { (context, msg) =>
    msg match {
      case Act.Join(player2) => players match {
        case Players.Waiting(player1) =>
          party(Players.Full(player1, player2))
        case Players.Full(_, _) =>
          Behaviors.same
      }

      case Act.Status(ref) =>
        reply(ref) {
          players.isFull
        }

      case Act.Quit(player) =>
        if (players.all.exists(_.id == player.id)) {
          players.all.foreach(_.close())
          Behaviors.stopped
        } else {
          Behaviors.same
        }
    }
  }

}
