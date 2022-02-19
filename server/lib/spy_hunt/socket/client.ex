#
#  client.ex
#  server
#
#  Created by d-exclaimation on 15:35.
#

defmodule SpyHunt.Socket.Client do
  @moduledoc """
  Structure for Socket client
  """
  use TypedStruct

  typedstruct do
    @typedoc "A representation of a WebSocket client"

    field(:pid, pid(), enforce: true)
  end

  @doc """
  Send a message to a client
  """
  @spec send(t(), String.t(), any()) :: :ok
  def send(%__MODULE__{} = client, msg, opts \\ []) do
    Process.send(client.pid, msg, opts)
  end

  @doc """
  Send a message to a client after a certain delay
  """
  @spec send_after(t(), String.t(), non_neg_integer(), any()) :: reference()
  def send_after(%__MODULE__{} = client, msg, time, opts \\ []) do
    Process.send_after(client.pid, msg, time, opts)
  end
end
