/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

/* eslint-env node */

const path = require('path');
const webpack = require('webpack');
const { bundler, styles } = require('@ckeditor/ckeditor5-dev-utils');
const { CKEditorTranslationsPlugin } = require('@ckeditor/ckeditor5-dev-translations');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	performance: { hints: false },

	entry: path.resolve(__dirname, 'src', 'ckeditor.ts'),

	output: {
		library: 'ClassicEditor',
		path: path.resolve(__dirname, '../ckeditor-builds/attributico-editor'),
		filename: 'ckeditor.js',
		libraryTarget: 'umd',
		libraryExport: 'default'
	},

	optimization: {
		minimizer: [
			new TerserWebpackPlugin({
				sourceMap: true,
				terserOptions: {
					output: {
						// Preserve CKEditor 5 license comments.
						comments: /^!/
					}
				},
				extractComments: false
			})
		]
	},

	plugins: [
		new CKEditorTranslationsPlugin({
			language: 'ru',
			additionalLanguages: [ 'en' ],
			//buildAllTranslationsToSeparateFiles: true,
			//addMainLanguageTranslationsToAllAssets: true
		}),
		new webpack.BannerPlugin({
			banner: bundler.getLicenseBanner(),
			raw: true
		}),
		new webpack.ProvidePlugin({
			// Make jQuery / $ available in every module:
			$: 'jquery',
			jQuery: 'jquery',
			// NOTE: Required to load jQuery Plugins into the *global* jQuery instance:
			jquery: 'jquery',
			'window.jQuery': 'jquery'
		})
	],

	resolve: {
		extensions: [ '.ts', '.js', '.json' ]
	},

	module: {
		rules: [ {
			test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
			use: [ 'raw-loader' ]
		}, {
			test: /\.ts$/,
			use: 'ts-loader'
		}, {
			test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
			use: [ {
				loader: 'style-loader',
				options: {
					injectType: 'singletonStyleTag',
					attributes: {
						'data-cke': true
					}
				}
			}, {
				loader: 'css-loader'
			}, {
				loader: 'postcss-loader',
				options: {
					postcssOptions: styles.getPostCssConfig({
						themeImporter: {
							themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
						},
						minify: true
					})
				}
			} ]
		} ]
	}
};
