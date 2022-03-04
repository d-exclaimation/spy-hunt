//
//  Party.scala
//  spy-hunt
//
//  Created by d-exclaimation on 11:43 PM.
//

package actor

import akka.actor.typed.scaladsl.{AbstractBehavior, ActorContext, Behaviors}
import akka.actor.typed.{ActorRef, Behavior}
import model.protocol.{InMessage, OutMessage}
import model.{Agent, Players, Window}
import socket.Client

import scala.collection.mutable
import scala.util.Random

object Party {
  sealed trait Act

  object Act {
    case class Join(player2: Client) extends Act

    case class Status(ref: ActorRef[Boolean]) extends Act

    case class Incoming(player: Client, action: InMessage) extends Act

    case class Quit(player: Client) extends Act
  }

  case class State(
    agents: Seq[Agent]
  )

  def apply(client: Client): Behavior[Act] =
    Behaviors.setup(new Party(_, client))
}

final class Party(context: ActorContext[Party.Act], player1: Client) extends AbstractBehavior[Party.Act](context) {

  import Party._

  private var players: Players = Players.Waiting(player1)

  private val deck: mutable.ArrayDeque[Agent] = {
    val neutrals = (1 to 10)
      .map(_ => Agent.neutral())
    val player1s = (1 to 10)
      .map(_ => Agent.player1())
    val player2s = (1 to 10)
      .map(_ => Agent.player2())

    mutable.ArrayDeque.from(Random.shuffle(neutrals ++ player1s ++ player2s))
  }
  private val queue: mutable.ArraySeq[Agent] = {
    val seq = (1 to 5).map(_ => deck.removeHead())
    mutable.ArraySeq.from(seq)
  }

  private val windows: mutable.ArraySeq[Window] = mutable.ArraySeq(
    Window(), Window(), Window(), Window(), Window()
  )

  private var isPlayer1Turn: Boolean = true
  private var moves: Int = 2

  def onMessage(msg: Act): Behavior[Act] = msg match {
    case Act.Join(player2) => same {
      players match {
        case Players.Waiting(player1) =>
          players = Players.Full(player1, player2)

        case Players.Full(_, _) =>
          ()
      }
    }

    case Act.Incoming(actingPlayer, action) => same {
      val isValid = players match {
        case Players.Waiting(_) => false
        case Players.Full(player1, player2) => actingPlayer.id match {
          case player1.id => isPlayer1Turn && moves > 0
          case player2.id => !isPlayer1Turn && moves > 0
          case _ => false
        }
      }

      if (isValid) {
        action match {
          case InMessage.IndexedAction("fire", index) => fire(index)
          case InMessage.IndexedAction("lock", index) => lockOn(index)
          case InMessage.IndexedAction("call", index) => call(index)
          case InMessage.Action("shutter") => shutter()
          case InMessage.Action("next") => next()
          case _ => ()
        }

        players.sendJson[OutMessage] { team =>
          OutMessage.Update(
            state = state(team),
            allies = allyCount(team),
            foes = foeCount(team),
            isTurn = if (team == Agent.PLAYER1) isPlayer1Turn else !isPlayer1Turn
          )
        }

        moves -= 1
      }

      if (moves <= 0) {
        isPlayer1Turn = !isPlayer1Turn
        moves = 2
      }
    }

    case Act.Status(ref) => same {
      ref ! players.isFull
    }

    case Act.Quit(player) =>
      if (players.all.exists(_.id == player.id)) {
        players.all.foreach(_.close())
        Behaviors.stopped
      } else {
        this
      }
  }

  // MARK: - Computed State

  private def state(team: Int): Seq[Window.WithAgent] =
    windows.zip(queue).toSeq.map { case (w, a) => w.and(a.perspective(team)) }

  private def allyCount(team: Int): Int =
    (deck ++ queue).count(_.team == team)

  private def foeCount(team: Int): Int =
    (deck ++ queue).count(a => a.team != team && a.team != Agent.NEUTRAL)

  // MARK: - Actions

  private def next(): Unit = {
    val removed = queue(4)
    shift(4)
    deck.append(removed)
  }

  private def lockOn(i: Int): Unit = {
    if (i < 0 || i > 4) return
    val prev = windows(i)
    windows.update(i, Window(isOpen = prev.isOpen, isTargeted = true))
  }

  private def fire(i: Int, quick: Boolean = false): Unit = {
    if (i < 0 || i > 4) return
    if (!quick && !windows(i).isTargeted) return
    shift(i)
    windows.update(i, Window())
  }


  private def call(i: Int): Unit = {
    if (i < 0 || i > 4) return

    val saved = queue(i)
    shift(i)
    deck.append(saved)
  }

  private def shutter(): Unit = {
    for (i <- windows.indices) {
      val prev = windows(i)
      windows.update(i, Window(isOpen = false, isTargeted = prev.isTargeted))
    }
  }

  private def shift(i: Int): Unit = {
    if (i < 0 || i > 4) return
    val next = if (deck.nonEmpty) deck.removeHead() else Agent.neutral()
    if (i < 1) {
      for (j <- (1 to i).reverse) {
        queue.update(j, queue(j - 1))
      }
    }
    queue.update(0, next)
  }

  // MARK: - Utils

  private def same(on: => Unit): Party = {
    on
    this
  }
}