# BP

This project is part of a challenge and has been set up with a proxy. You only need to have the backend running. This project is using Angular 15 and requires Node.js version 18.20.6.

## Development server

Run `npm install` to install the dependencies, then run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Proxy

This project is using a proxy pointing to the backend at port 3002. If there are any changes, you need to modify the target accordingly:

```json
{
  "/api": {
    "target": "http://localhost:3002",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

## Docker

To build and run the Docker container for this project, use the following commands:

1. Build the Docker image:
   ```sh
   docker build -t bp-app .
