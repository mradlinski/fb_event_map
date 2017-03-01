# FB Event Map API

A simple Elixir webservice returning Facebook events near a geographical point.
An app using this webservice is hosted at https://mromnia.github.io/evmap.

## How to use

The API is currently hosted at https://fb-event-map.ml/events. To download events for a particular location, simply make a GET request with two parameters:
- lat - floating point number representing latitude
- lng - floating point number representing longitude

If you plan on using the API more than a couple of times a day, *PLEASE* also provide your own Facebook access token in a custom request header:
- FB-Token-Auth (header)

Facebook's API is rate limited, and every batch of events downloaded is a dozen or so requests.
If you don't know how to get a Facebook access token, the simplest way is to create a Facebook app and use a string in the format "app_id|app_secret" as the access token. Yes, the "|" character is supposed to be there.

## Technology used
- Backend
	- Elixir
	- Plug (no Phoenix - seemed overkill)
	- Redis (caching requests to Facebook API)
	- Docker / Docker Compose


- Frontend
	- JavaScript (no framework, just slightly messy vanilla JS + jQuery)
	- Google Maps

## TODO
- Proper error handling
- Tests
- Possibly some better way to deploy

## Motivation
This project was created mostly to learn some Elixir and Docker. The method for downloading Facebook events was heavily inspired by https://github.com/tobilg/facebook-events-by-location-core.
