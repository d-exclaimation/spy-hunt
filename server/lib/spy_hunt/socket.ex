#
#  socket.ex
#  server
#
#  Created by d-exclaimation on 14:16.
#

defmodule SpyHunt.Socket do
  @moduledoc """
    WebSocket Handler
  """
  @behaviour :cowboy_websocket

  alias SpyHunt.Socket.Client

  @type state :: %{
          client: Client.t(),
          room: String.t() | non_neg_integer() | nil
        }
  @type response :: {:ok, state()} | {:reply, {:text, binary()}, state()}

  @protocol "spyhunt-ws"

  @spec init(:cowboy_req.req(), state()) :: {:cowboy_websocket, :cowboy_req.req(), state()}
  def init(%{headers: %{"sec-websocket-protocol" => protocols}} = request, _state) do
    # Dummy state
    state = %{
      client: %Client{pid: self()},
      room: nil
    }

    # Getting the sub-protocols
    subs =
      protocols
      |> String.split(",")
      |> Enum.map(&String.trim/1)

    # Validating subprotocol
    using_protocol? = fn subprotocol ->
      subprotocol === @protocol
    end

    with [h | t] <- subs,
         true <- Enum.any?([h | t], using_protocol?) do
      new_request =
        :cowboy_req.set_resp_header(
          "sec-websocket-protocol",
          "#{@protocol}",
          request
        )

      {:cowboy_websocket, new_request, state}
    else
      _ ->
        {:cowboy_websocket, :cowboy_req.reply(400, request), state}
    end
  end

  @spec websocket_init(state()) :: response()
  def websocket_init(_state) do
    # Initial valid state
    client = %Client{pid: self()}

    response =
      Jason.encode!(%{
        type: "init",
        payload: %{
          id: inspect(client.pid)
        }
      })

    %{index: index} =
      SpyHunt.Gateway
      |> GenServer.call({:join, client})

    state = %{
      client: client,
      room: index
    }

    IO.puts("A client connected successfully with a pid of #{inspect(state.client)}")

    {:reply, {:text, response}, state}
  end

  @spec websocket_handle({:text, any()}, state()) :: response()
  def websocket_handle({:text, json}, state) do
    resp = Jason.decode(json)
    # TODO: Push to Gateway then into each Lobby
    IO.inspect(resp)
    {:ok, state}
  end

  @spec websocket_info(String.t(), state()) :: response()
  def websocket_info(message, state) do
    {:reply, {:text, message}, state}
  end

  @spec terminate(atom() | any(), map(), state()) :: :ok
  def terminate(reason, _req, %{room: _room} = state) do
    # TODO: Cleanup to Gateway using the room info
    IO.puts("#{inspect(state.client.pid)} disonnected because of #{inspect(reason)}")
    :ok
  end
end
