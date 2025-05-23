/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FontBackgroundColor, FontColor } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
	Image,
	ImageCaption,
	ImageInsert,
	ImageStyle,
	ImageToolbar,
	//ImageUpload
} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { Undo } from '@ckeditor/ckeditor5-undo';

//import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { Plugin } from '@ckeditor/ckeditor5-core';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

import * as $ from "jquery";
import * as Bootstrap from 'bootstrap';
import 'bootstrap/dist/js/bootstrap.min.js';

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.
class InsertImage extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add('insertImage', locale => {
			const view = new ButtonView(locale);

			view.set({
				label: 'Insert image',
				icon: imageIcon,
				tooltip: true
			});

			// Callback executed once the image is clicked.
			view.on('execute', () => {

				let imageUrl = '';
				const url = window.location;
				const user_token = new URLSearchParams(url.search).get('user_token');

				$('body').append('<div class="modal ckeditor" id="modal-image"></div>');

				$.ajax({
					/* url: 'index.php?route=common/filemanager&cke=' + 'info:txtUrl' + '&token=' + token, */
					url: 'index.php?route=common/filemanager&token=' + user_token + '&user_token=' + user_token,
					dataType: 'html',
					success: function (html) {
						$('#modal-image').html(html);
						$('#modal-image').modal('show');
						$('#modal-image').off('click', 'a.thumbnail') // Clean event otherwise it will multiply      
						$('#modal-image').on('click', 'a.thumbnail', function (e) {							
							e.preventDefault();
							imageUrl = this.getAttribute('href')!
							editor.model.change(writer => {
								const imageElement = writer.createElement('imageBlock', {
									src: imageUrl
								});
								// Insert the image in the current selection location.
								editor.model.insertContent(imageElement, editor.model.document.selection);
							});
							$('#modal-image').off('click', 'a.thumbnail') // Clean event otherwise it will be handled in attributico
							$('#modal-image').modal('hide');
						});
					}
				});
			});

			return view;
		});
	}
}

class Editor extends ClassicEditor {
	public static override builtinPlugins = [
		Autoformat,
		BlockQuote,
		Bold,
		Essentials,
		FontBackgroundColor,
		FontColor,
		Heading,
		Image,
		ImageCaption,
		ImageInsert,
		ImageStyle,
		ImageToolbar,
		//ImageUpload,
		InsertImage,
		Indent,
		Italic,
		Link,
		List,
		MediaEmbed,
		Paragraph,
		Table,
		TableToolbar,
		TextTransformation,
		Undo
	];

	public static override defaultConfig: EditorConfig = {
		toolbar: {
			items: [
				'undo',
				'redo',
				'heading',
				'|',
				'bold',
				'italic',
				'fontBackgroundColor',
				'fontColor',
				'link',
				'bulletedList',
				'numberedList',
				'|',
				'outdent',
				'indent',
				'|',
				//'imageUpload',
				'insertImage',
				'blockQuote',
				'insertTable',
				'mediaEmbed'
			]
		},
		language: 'ru',
		image: {
			toolbar: [
				'imageTextAlternative',
				'toggleImageCaption',
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:side'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		}
	};
}

export default Editor;
