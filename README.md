# tedbot

>   A JavaScript Discord bot

## Resources

-   [Discord API](https://discordapp.com/developers/docs/intro)
-   [Node.js](https://nodejs.org/)
    -   [discord.js](https://www.npmjs.com/package/discord.js)
    -   [bufferutil](https://www.npmjs.com/package/bufferutil)
-   [Winston](https://github.com/winstonjs/winston)

## Instructions

-   Add `config.json` in the project root, then add bot command prefix, bot token, allowed servers, and bot activity in the file. Activity types are defined in the [discord.js documentation](https://discord.js.org/#/docs/main/stable/typedef/ActivityType)

    ```json
    {
      "PREFIX": "<command prefix>",
      "TOKEN": "<bot token>",
      "SERVERS": {
          "<server name>": "<server id>"
      },
      "ACTIVITY_TYPE": "<{ActivityType}>",
      "ACTIVITY": "<{string}>"
    }
    ```
-   Install dependencies and ignore optional discord.js peers
    ```sh
    npm install
    ```
-   Run the application
    ```sh
    npm start
    ```
-   To add the bot to a server, go to the link output by node
    ```
    https://discordapp.com/oauth2/authorize?client_id=<CLIENT_ID>&permissions=134474881&scope=bot
    ```
-   Run the `${prefix}help` command in Discord to receive a dm from the bot with all possible commands
