# Door

This is a web server which provides a restful api for interacting with the [ACCX Open Access 4.0](http://www.accxproducts.com/wiki/index.php?title=Open_Access_4.0).

## Development

Development of the server happens in this repository, which includes build tooling and support files.
The compiled output is packaged and hosted privately in the package repository at npm.pkg.github.com

The companion Door Runner app on the Raspberry Pi consumes the package and runs it on the device.

### Install tooling

* [nodejs](https://nodejs.org/en/)

### Install project dependencies

```
$ npm install
```

### Start developing

Start the TypeScript compiler in watch mode and run the server under nodemon
with this command.

```
$ npm run server
```

## Publishing

Compile the server and publish the package the private npm registry with this
command.

```
$ npm run push
```
