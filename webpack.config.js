const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const browserify = require('browserify')
const path = require('path')
const fs = require('fs')
const os = require('os')
const dts = require('dts-bundle')
const deleteEmpty = require('delete-empty')
const packageName = require('./package.json')

const getLibraryPath = (name) => {
	return (!name) ? 'dist' : path.join('dist', name)
}

const outputCleanup = (dir, initial) => {
	if (!fs.existsSync(getLibraryPath())) {
		return
	}
	if (initial) {
		console.log("Build leftover found, cleans it up.")
	}
	var list = fs.readdirSync(dir);
	for (var i = 0; i < list.length; i++) {
		var filename = path.join(dir, list[i]);
		var stat = fs.statSync(filename)
		if (filename == "." || filename == "..") {
		} else if (stat.isDirectory()) {
			outputCleanup(filename, false);
		} else {
			fs.unlinkSync(filename);
		}
	}
	fs.rmdirSync(dir)
};

const percentageHandler = (percentage, msg) => {
	if (!percentage) {
		outputCleanup(getLibraryPath(), true);
		console.log("Begin transmute-framework build...");
	} else if (1 == percentage) {
		// TODO: Check for errors here or bail... or something...
		createBrowserVersion(webpackOpts.output.filename);
		console.log("Bundling d.ts files ...");
		dts.bundle(bundleOpts);
		deleteEmpty(bundleOpts.baseDir, (err, deleted) => {
			if (err) {
				console.error("Cleaning failed: " + err);
				throw err;
			} else {
				console.log("Cleaned successfully: " + deleted);
			}
		});
	}
}

const bundleOpts = {
	name: packageName.name,
	main: 'src/main.d.ts',
	baseDir: 'src',
	out: '../dist/main.d.ts',
	externals: false,
	referenceExternals: false,
	exclude: /^defs\/$/,
	removeSource: true,
	newline: os.EOL,
	indent: '	',
	prefix: '',
	separator: '/',
	verbose: false,
	emitOnIncludedFileNotFound: false,
	emitOnNoIncludedFileNotFound: false,
	outputAsModuleFolder: false
};

const webpackOpts = {
	entry: './src/main.ts',
	target: 'node',
	output: {
		filename: getLibraryPath('main.js'),
		libraryTarget: "commonjs2"
	},
	resolve: {
		extensions: ['', '.ts', '.js'],
		modules: [
			'node_modules',
			'src',
		]
	},
	module: {
		preLoaders: [{ test: /\.ts$/, loaders: ['tslint'] }],
		loaders: [{ test: /\.ts$/, loaders: ['babel-loader', 'awesome-typescript-loader'] }]
	},
	externals: [nodeExternals()],
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.ProgressPlugin(percentageHandler)
	],
	tslint: {
		emitErrors: true,
		failOnHint: true
	}
}

const createBrowserVersion = (inputJs) => {
	let outputName = inputJs.replace(/\.[^/.]+$/, "");
	outputName = `${outputName}.browser.js`;
	console.log("Begin creating browser version ...");
	let b = browserify(inputJs, {
		standalone: bundleOpts.name,
	});
	b.bundle((err, src) => {
		if (err != null) {
			console.error("Browserify failed: ");
			console.error(err);
		}
	}).pipe(fs.createWriteStream(outputName));
}

module.exports = webpackOpts;
