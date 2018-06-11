# tedbot

>   My discord bot

## Resources used

-   [Discord API](https://discordapp.com/developers/docs/intro)
-   [Node.js](https://nodejs.org/)
    -   [discord.js](https://www.npmjs.com/package/discord.js)
    -   [bufferutil](https://www.npmjs.com/package/bufferutil)
    -   [erlpack](https://github.com/discordapp/erlpack)

## Instructions

-   Add `config.json` in the project root, then add bot command prefix, bot token, and allowed servers in the file

    ```json
    {
      "prefix": "<COMMAND_PREFIX>",
      "token": "<BOT_TOKEN>",
      "servers": {
          "<SERVER_NAME>": "<SERVER_ID>"
      }
    }
    ```
-   Install dependencies
    ```sh
    npm install
    ```
