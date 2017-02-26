defmodule FbEventMap.PlaceCache do
  @empty_val "0"

  def save(place) do
    key = build_key(place.id)
    data = Poison.encode!(place)
    Redix.command!(:redix, ["SETEX", key, "3600", "#{data}"])
  end

  def save_empty(id) do
    key = build_key(id)
    Redix.command!(:redix, ["SETEX", key, "36000", @empty_val])
  end

  def get(id) do
    key = build_key(id)
    case Redix.command!(:redix, ["GET", key]) do
      nil -> nil
      @empty_val -> :empty
      result -> Poison.decode!(result)
    end
  end

  defp build_key(id) do
    "place:#{id}"
  end
end
