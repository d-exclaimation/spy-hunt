#
#  gateway.ex
#  server
#
#  Created by d-exclaimation on 17:02.
#

defmodule SpyHunt.Gateway do
  @moduledoc """
  Gateway GenServer, prior to entering the gateway all process must be taken as asynchronous
  """
  use GenServer

  alias SpyHunt.Socket.Client

  @type state :: %{
          lobbies: [any()]
        }

  @doc """
  Start the genserver
  """
  @spec start_link(GenServer.options()) :: GenServer.on_start()
  def start_link(_opts) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  @impl true
  @spec init(any()) :: {:ok, state()}
  def init(:ok) do
    {:ok, %{lobbies: []}}
  end

  @impl true
  @spec handle_call({:join, Client.t()}, GenServer.from(), state()) :: {:reply, %{}, state()}
  def handle_call({:join, %Client{} = c}, _from, %{lobbies: lobbies}) do
    case Enum.find_index(lobbies, fn lobby -> Enum.count(lobby) < 2 end) do
      nil ->
        new_lobbies = [[c] | lobbies]
        {:reply, %{}, %{lobbies: new_lobbies}}

      i ->
        new_lobbies =
          lobbies
          |> Enum.with_index()
          |> Enum.map(fn {lobby, j} ->
            if i == j, do: [c | lobby], else: lobby
          end)

        {:reply, %{}, %{lobbies: new_lobbies}}
    end
  end

  @impl true
  @spec handle_cast(:test, state()) :: {:noreply, state()}
  def handle_cast(:test, state) do
    IO.inspect(state)
    {:noreply, state}
  end
end
