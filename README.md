
<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>


# homebridge-garage-nexx

A super unofficial homebridge to manage Nexx NXG-200 and NXG-300 garage door openers.

## Configuration

If you're feeling hacky, get the clientId by following the instructions [here](https://github.com/jontg/nexx-garage-sdk#how-to-find-the-client_id).
The username and password are what you use to log into the app.

```json
{
    "platforms": [
        {
          "name": "homebridge-garage-nexx",
          "platform": "HomebridgeGarageNexx",
          "auth": {
            "password": "SUPER_SECRET_PASSWORD",
            "username": "SUPER_SECRET_USERNAME",
            "clientId": "SUPER_SECRET_CLIENT_ID",
            "deviceToken": null,
            "userAgent": "NexxHome/3.8.2 (com.simpaltek.nexxhome; build:3; iOS 16.2.0) Alamofire/4.9.1"
          }
        }
    ]
}
```

# Setup Development Environment

To develop Homebridge plugins you must have Node.js 12 or later installed, and a modern code editor such as [VS Code](https://code.visualstudio.com/). This plugin template uses [TypeScript](https://www.typescriptlang.org/) to make development easier and comes with pre-configured settings for [VS Code](https://code.visualstudio.com/) and ESLint. If you are using VS Code install these extensions:

* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Install Development Dependencies

Using a terminal, navigate to the project folder and run this command to install the development dependencies:

```
npm install
```

## Update package.json

Open the [`package.json`](./package.json) and change the following attributes:

* `name` - this should be prefixed with `homebridge-` or `@username/homebridge-` and contain no spaces or special characters apart from a dashes
* `displayName` - this is the "nice" name displayed in the Homebridge UI
* `repository.url` - Link to your GitHub repo
* `bugs.url` - Link to your GitHub repo issues page

When you are ready to publish the plugin you should set `private` to false, or remove the attribute entirely.

## Build Plugin

TypeScript needs to be compiled into JavaScript before it can run. The following command will compile the contents of your [`src`](./src) directory and put the resulting code into the `dist` folder.

```
npm run build
```

## Link To Homebridge

Run this command so your global install of Homebridge can discover the plugin in your development environment:

```
npm link
```

You can now start Homebridge, use the `-D` flag so you can see debug log messages in your plugin:

```
homebridge -D
```

## Watch For Changes and Build Automatically

If you want to have your code compile automatically as you make changes, and restart Homebridge automatically between changes, you first need to add your plugin as a platform in `~/.homebridge/config.json`:
```
{
...
    "platforms": [
        {
            "name": "Config",
            "port": 8581,
            "platform": "config"
        },
        {
          "name": "homebridge-garage-nexx",
          "platform": "HomebridgeGarageNexx",
          "auth": {
            "password": "SUPER_SECRET_PASSWORD",
            "username": "SUPER_SECRET_USERNAME",
            "clientId": "SUPER_SECRET_CLIENT_ID",
            "deviceToken": null,
            "userAgent": "NexxHome/3.8.2 (com.simpaltek.nexxhome; build:3; iOS 16.2.0) Alamofire/4.9.1"
          }
        }
    ]
}
```

and then you can run:

```
npm run watch
```

This will launch an instance of Homebridge in debug mode which will restart every time you make a change to the source code. It will load the config stored in the default location under `~/.homebridge`. You may need to stop other running instances of Homebridge while using this command to prevent conflicts. You can adjust the Homebridge startup command in the [`nodemon.json`](./nodemon.json) file.
