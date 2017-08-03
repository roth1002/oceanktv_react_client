Karaoke Station with QTS
=====
### Dependencies
[package.json](/package.json)

- [x] [Webpack](https://webpack.github.io)
- [x] [React](https://facebook.github.io/react/)
- [x] [Redux](https://github.com/reactjs/redux)
- [x] [Babel](https://babeljs.io/)
- [x] [Autoprefixer](https://github.com/postcss/autoprefixer)
- [x] [PostCSS](https://github.com/postcss/postcss)
- [x] [Rucksack](http://simplaio.github.io/rucksack/docs)
- [x] [React Router Redux](https://github.com/reactjs/react-router-redux)
- [x] [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)

### Configuration
- `webpack.config.dev.js` for development
- `webpack.config.prod.js` for production
- Move the DevTools with `Ctrl+W` or hide them with `Ctrl+H`.

#### Development
```bash
$ sudo npm install -g babel-eslint && npm install
$ npm start
# Listening at http://localhost:8080 with the default API root

$ npm start -- -h 192.168.0.X
$ npm start -- --host=192.168.0.X
# To specify the API root url
```

### Test and coverage
```bash
$ npm t
$ npm run cover
```

#### Production
```bash
$ npm run deploy
# all files were built in the `dist` folder
```
