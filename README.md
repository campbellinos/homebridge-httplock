# Httplock Plugin

Example config.json:

    {
      "accessories": [
        {
            "accessory": "Httplock",
            "name": "Front Door",
            "url": "your-custom-or-homegrown-service-url",
			"ssl-root-ca-cert": "your-https-server-root-or-chain-certfile",
			"lock-id": "1",
            "username" : "your-username",
			"password" : "your-password"
        }
      ]
    }

This plugin supports locks controlled by any custom HTTPS endpoint via GET (to get state, either "locked" or "unlocked"), and POST (to set new state, same two values). The "lock-id", "username" and "password" parameters are passed along to "url" in each GET request. The same parameters plus "state" are passed along to "url" in each POST request.