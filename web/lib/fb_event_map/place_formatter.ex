defmodule FbEventMap.PlaceFormatter do
  use Timex
  require EEx
  EEx.function_from_string :defp, :create_place_description, """
    <h3><%= @name %></h3>
    <%= for ev <- @events do %>
  		<p>
  			<a href="https://www.facebook.com/events/<%= ev.id %>" target="_blank">
          <%= ev.name %> (<%= ev.start_time_readable %>)
        </a>:
  			<%= ev.description %>
  		</p>
    <% end %>
  """, [:assigns], [trim: true]

  def format_place(p) do
    place = %{
      id: p["id"],
      name: p["name"],
      location: p["location"],
      events:
        Enum.map(p["events"]["data"], &format_event/1)
          |> Enum.sort_by(&(&1.start_time))
    }

    Map.put(place, :description, create_place_description(place))
  end

  defp format_event(ev) do
    start_time = Timex.parse!(ev["start_time"], "{ISO:Extended}")

    %{
      id: ev["id"],
      name: ev["name"],
      start_time: Timex.to_unix(start_time),
      start_time_readable:
        start_time
          |> Timex.format!("{YYYY}/{0M}/{0D} {h24}:{m} {Zabbr}"),
      attending_count: ev["attending_count"],
      description: case ev["description"] do
        nil -> ""
        _ -> ellipsis(ev["description"], 200)
      end
    }
  end

  defp ellipsis(str, max_length) do
    if String.length(str) > max_length do
      String.slice(str, 0, max_length - 3) <> "..."
    else
      str
    end
  end
end
