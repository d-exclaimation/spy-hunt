//
//  Players.scala
//  spy-hunt
//
//  Created by d-exclaimation on 9:06 PM.
//


package model

import socket.Client

sealed trait Players {
  def player1: Client

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