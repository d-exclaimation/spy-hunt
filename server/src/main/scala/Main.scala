//
//  Main.scala
//  spy-hunt
//
//  Created by d-exclaimation on 1:41 PM.
//

import akka.http.scaladsl.Http
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import constants.Environments
import de.heikoseeberger.akkahttpcirce.FailFastCirceSupport
import implicits.Services._
import io.circe.generic.auto._
import model.TemplateResponse

import scala.io.StdIn


object Main extends FailFastCirceSupport {

  val route: Route =
    pathPrefix("api") {
      complete(
        TemplateResponse(
          `type` = "ok",
          payload = "HTTP here"
        )
      )
    } ~ path("ws") {
      Socket.applyMiddleware()
    } ~ path(Remaining) { _ =>
      redirect(
        uri = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        StatusCodes.PermanentRedirect
      )
    }

  def main(args: Array[String]): Unit = {
    val fut = Http()
      .newServerAt("localhost", Environments.__port__)
      .bind(route)

    StdIn.readLine()
    fut.flatMap(_.unbind())
      .onComplete(_ => system.terminate())
  }
}
