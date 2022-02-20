ThisBuild / scalaVersion := "2.13.7"
ThisBuild / version := "0.1.0-SNAPSHOT"

lazy val root = (project in file("."))
  .settings(
    name := "spy-hunt",
    libraryDependencies ++= {
      val AkkaVersion = "2.6.18"
      val AkkaHttpVersion = "10.2.8"
      val AkkaHttpJsonVersion = "1.39.2"
      val CirceVersion = "0.14.1"


      Seq(
        "com.typesafe.akka" %% "akka-actor-typed" % AkkaVersion,
        "com.typesafe.akka" %% "akka-stream" % AkkaVersion,
        "com.typesafe.akka" %% "akka-stream-typed" % AkkaVersion,
        "com.typesafe.akka" %% "akka-http" % AkkaHttpVersion,
        "de.heikoseeberger" %% "akka-http-circe" % AkkaHttpJsonVersion,
        "ch.megard" %% "akka-http-cors" % "1.1.3",
        "ch.qos.logback" % "logback-classic" % "1.2.10",

        "io.circe" %% "circe-core" % CirceVersion,
        "io.circe" %% "circe-generic" % CirceVersion,
        "io.circe" %% "circe-parser" % CirceVersion,


        "org.scalatest" %% "scalatest" % "3.2.9" % Test
      )
    }
  )

