defmodule FbEventMap.FbApi do
  defmodule FbApiException do
    defexception message: "Invalid FB OAuth token"
  end

  def default_fb_token do
    Application.fetch_env!(:fb_event_map, :default_fb_token)
  end

  def get_places_at_loc(lat, lng, fb_token \\ default_fb_token()) do
    case fb_api_request("/search", [
      type: "place",
      center: "#{lat},#{lng}",
      distance: 2500,
      limit: 1000
    ], fb_token) do
      {:ok, places} -> places
      {:error, %{"type" => "OAuthException"}} -> raise FbApiException
    end
  end

  def get_place_ids_at_loc(lat, lng, fb_token \\ default_fb_token()) do
    get_places_at_loc(lat, lng, fb_token) |> fetch_ids_from_places
  end

  defp fetch_ids_from_places(place_data) do
    place_data
      |> Map.fetch!("data")
      |> Enum.map(&(&1["id"]))
  end

  def get_places_batch(id_batch, fb_token \\ default_fb_token()) do
    current_time = DateTime.utc_now() |> DateTime.to_unix()

    case fb_api_request("/", [
      ids: Enum.join(id_batch, ","),
      fields: "id,name,location,events.fields(id,type,name,description,start_time,end_time,category,attending_count,maybe_count).limit(10).since(#{current_time})",
    ], fb_token) do
      {:ok, places} -> places
      {:error, %{"type": "OAuthException"}} -> raise FbApiException
    end
  end

  defp fb_api_request(url, params, fb_token) do
    full_url = "https://graph.facebook.com/v2.8" <> url
    params_with_token = [{:access_token, fb_token} | params]

    case HTTPoison.get(full_url, [], [params: params_with_token]) do
      {:ok, response} -> case Poison.decode(response.body) do
        {:ok, %{"error" => err}} -> {:error, err}
        {:ok, decoded_response} -> {:ok, decoded_response}
      end
      {:error, err} -> {:error, err}
    end
  end
end
