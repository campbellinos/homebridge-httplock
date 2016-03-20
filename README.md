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

This plugin supports locks controlled by any custom HTTP endpoint via GET (to get state, either "locked" or "unlocked"), and PUT (to set new state, same possible values). The "lock-id", "username" and "password" parameters are passed along to "url" in each GET request. The same parameters plus "state" are passed along to "url" in each PUT request.