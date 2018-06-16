# tedbot

>   A JavaScript Discord bot

## Resources used

-   [Discord API](https://discordapp.com/developers/docs/intro)
-   [Node.js](https://nodejs.org/)
    -   [discord.js](https://www.npmjs.com/package/discord.js)
    -   [bufferutil](https://www.npmjs.com/package/bufferutil)
    -   [erlpack](https://github.com/discordapp/erlpack)

## Instructions

-   Add `config.json` in the project root, then add bot command prefix, bot token, and allowed servers in the file

    ```js
    {
      "prefix": "<COMMAND_PREFIX>",
      "token": "<BOT_TOKEN>",
      "servers": {
          "<SERVER_NAME>": "<SERVER_ID>"
      }
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
