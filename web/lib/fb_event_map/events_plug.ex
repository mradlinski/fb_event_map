defmodule FbEventMap.EventsPlug do
  import Plug.Conn

  def init(opts) do
    opts
  end

  def call(conn, _opts) do
    conn = Plug.Conn.fetch_query_params(conn)
    lat = conn.params["lat"]
    lng = conn.params["lng"]

    fb_token = case Plug.Conn.get_req_header(conn, "fb-token-auth") do
      [token | _] -> token
      [] -> ""
    end

    try do
      data = if fb_token == "" do
        FbEventMap.FbEvents.get_places_with_events_at_loc(lat, lng)
      else
        FbEventMap.FbEvents.get_places_with_events_at_loc(lat, lng, fb_token)
      end

      send_resp(conn, 200, Poison.encode!(data))
    rescue
      e in FbEventMap.FbApi.FbApiException -> send_resp(conn, 401, e.message)
    end
  end
end
