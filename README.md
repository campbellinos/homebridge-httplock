# Httplock Plugin

Example config.json:

    {
      "accessories": [
        {
            "accessory": "Httplock",
            "name": "Front Door",
            "url": "your-custom-or-homegrown-service-url",
			"lock-id": "1",
            "username" : "your-username",
			"password" : "your-password"
        }
      ]
    }

This plugin supports locks controlled by any custom HTTP endpoint via GET (to get state and battery), and PUT (to set new state). The "lock-id", "username" and "password" parameters are passed along to "url" in each GET request. The same parameters plus "state" (either "locked" or "unlocked") are passed along to "url" in each PUT request.