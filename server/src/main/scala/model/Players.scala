//
//  Players.scala
//  spy-hunt
//
//  Created by d-exclaimation on 9:06 PM.
//


package model

import io.circe.Encoder
import socket.Client

sealed trait Players {
  def player1: Client

  def isFull: Boolean

  def all: Seq[Client]

  def sendJson[T](jsonFunc: Int => T)(implicit encoder: Encoder[T]): Unit
}

object Players {
  case class Waiting(player1: Client) extends Players {
    val isFull = false

    def all = Seq(player1)

    def sendJson[T](jsonFunc: Int => T)(implicit encoder: Encoder[T]): Unit = {
      val json = jsonFunc(Agent.PLAYER1)
      player1.sendJson(json)(encoder)
    }
  }

  case class Full(player1: Client, player2: Client) extends Players {
    val isFull = true

    def all = Seq(player1, player2)

    def sendJson[T](jsonFunc: Int => T)(implicit encoder: Encoder[T]): Unit = {
      player1.sendJson(jsonFunc(Agent.PLAYER1))(encoder)
      player2.sendJson(jsonFunc(Agent.PLAYER2))(encoder)
    }
  }
}