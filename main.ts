import {
	App,
	Editor,
	MarkdownView,
	Plugin,
	PluginSettingTab,
	Setting,
	Modal,
	moment,
} from "obsidian";

//markdown代码
const markdownCodes = [
	{ key: "H1", name: "标题1", code: "# " },
	{ key: "H2", name: "标题2", code: "## " },
	{ key: "H3", name: "标题3", code: "### " },
	{ key: "H4", name: "标题4", code: "#### " },
	{ key: "H5", name: "标题5", code: "##### " },
	{ key: "H6", name: "标题6", code: "###### " },
	{ key: "Tag", name: "标签", code: "#" },
	{ key: "Bold", name: "加粗", code: "**{}**", cursor: -2 },
	{ key: "Italic", name: "斜体", code: "*{}*", cursor: -1 },
	{ key: "Strike", name: "删除线", code: "~~{}~~", cursor: -2 },
	{ key: "Highlight", name: "高亮", code: "=={}==", cursor: -2 },
	{ key: "UnderLine", name: "下划线", code: "<u>{}</u>", cursor: -4 },
	{ key: "Hr", name: "分割线", code: "---\n" },
	{ key: "Date", name: "日期", code: "YYYY-MM-DD ddd" },
	{ key: "Time", name: "时间", code: "YYYY-MM-DD HH:mm:ss" },
	{ key: "Color", name: "颜色", code: "<font color=\"{1}\">{2}</font>", cursor: -7 },
	{key: "BgColor", name: "背景色", code: "<span style=\"background:{1}\">{2}</span>", cursor: -7},
	{ key: "Indent", name: "缩进", code: "\t" },
	{ key: "Sup", name: "上标", code: "<sup>{}</sup>", cursor: -6 },
	{ key: "Sub", name: "下标", code: "<sub>{}</sub>", cursor: -6 },
	{ key: "List", name: "列表项", code: "- " },
	{ key: "OrderList", name: "有序列表", code: "1. " },
	{ key: "Task", name: "任务项", code: "- [ ] " },
	{ key: "Quote", name: "引用", code: "> " },
	{ key: "Code", name: "行内代码", code: "`{}`", cursor: -1 },
	{ key: "CodeBlock", name: "代码块", code: "```\n{}\n```", cursor: -3 },
	{ key: "Link", name: "链接", code: "[{1}]({2} \"{3}\")", cursor: -4 },
	{ key: "Image", name: "图片", code: "![{1}]({2} \"{3}\")", cursor: -4 },
	{ key: "Table", name: "表格", code: "| | |\n|:-:|:-:|\n| | |" },
	{ key: "Audio", name: "音频", code: "<audio controls=\"controls\" preload=\"none\" src=\"{1}\"></audio>" },
	{ key: "Video", name: "视频", code: "<video width=\"{1}\" height=\"{2}\" controls><source src=\"{3}\" type=\"video/{4}\"></video>" },
	{ key: "Iframe", name: "嵌入网页", code: "<iframe width=\"{1}\" height=\"{2}\" src=\"{3}\" scrolling=\"auto\" border=\"0\" frameborder=\"no\" framespacing=\"0\" allowfullscreen=\"true\"></iframe>" },
];

//常见颜色
//see https://zhuanlan.zhihu.com/p/508870810
let colors = [
	'#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'
];

// 参与禅模式的元素
const zenSplits = [
	".workspace",
	".status-bar",
	".workspace-ribbon.mod-left",
	".workspace-split.mod-left-split",
	".workspace-split.mod-right-split",
	".workspace-split.mod-root",
	".workspace-tabs.mod-active.mod-top > .workspace-tab-header-container",
	".workspace-leaf.mod-active .view-header",
	".workspace-leaf.mod-active .view-content",
	".workspace-leaf.mod-active",
];

const zenModeDefaultStyle = `
/* 整个工作区样式 */
.theme-light .workspace-leaf.mod-active .view-content.ii-zen {
	background-color: #05456e!important;
}
.theme-dark .workspace-leaf.mod-active .view-content.ii-zen {
	background-color: #05456e!important;
}

/* 编辑器样式 */
.theme-light .workspace-leaf.mod-active.ii-zen .cm-sizer{
	background-color: antiquewhite;
	padding: 20px;
	box-shadow: 0px 0px 100px 15px #000;
	border-radius: 8px;
}
.theme-dark .workspace-leaf.mod-active.ii-zen .cm-sizer{
	background-color: rgb(114, 99, 80);
	padding: 20px;
	box-shadow: 0px 0px 100px 15px #000;
	border-radius: 8px;
	color:  #ccc;
}
`

interface IIPluginSettings {
	quickInsert: boolean;
	showDocSize:boolean;
	zenMode: boolean;
	showChinese: boolean;
	showColorPicker: boolean;
	showImgLinkDialog: boolean;
	showMediaDialog: boolean;
	showImgLinkTipText: boolean;
	commonColors: string;
	date: string;
	time: string;
	zenModeStyle: string;
	onlyStandardCode: boolean;
}

const DEFAULT_SETTINGS: IIPluginSettings = {
	quickInsert: true,
	showDocSize: true,
	zenMode: true,
	showChinese: moment.locale() === "zh-cn",
	showColorPicker: true,
	showImgLinkDialog: true,
	showMediaDialog: true,
	showImgLinkTipText: true,
	commonColors: colors.join("\n"),
	date: "YYYY-MM-DD ddd",
	time: "YYYY-MM-DD HH:mm:ss",
	zenModeStyle: zenModeDefaultStyle,
	onlyStandardCode: false,
};


export default class IIPlugin extends Plugin {
	settings: IIPluginSettings;

	async onload() {
		console.log("loading ii plugin");

		await this.loadSettings();

		//注册快速插入Markdown代码命令
		this.registerQuickInsertCommand();

		//状态栏显示当前文件大小
		const statusBarItemEl = this.addStatusBarItem();
		this.registerEvent(this.app.workspace.on('active-leaf-change', () => {
			if (!this.settings.showDocSize) {
				return;
			}
			const fileSize = this.app.workspace.getActiveFile()?.stat.size || 0;
			const kb = fileSize / 1024;
			const mb = kb / 1024;
			if (fileSize < 1024 * 1024) {
				statusBarItemEl.setText(`${kb.toFixed(2)} KB`);
			} else {
				statusBarItemEl.setText(`${mb.toFixed(2)} MB`);
			}
		}));


		//禅模式
		this.addCommand({
			id: "ii-plugin-zen",
			name: "zen" + (this.settings.showChinese?`（禅模式）`:''),
			checkCallback: (checking: boolean) => {
				if (this.settings.zenMode) {
					if (!checking) {
						if(!document.fullscreenElement) {
							document.body.requestFullscreen();
						} else {
							document.exitFullscreen();
						}
					}
					return true;
				}
				return false;
			},
		});

		// const doc = this.app.workspace.containerEl.doc;
		// const header = doc.head;
		// const body = doc.body;
		// const styleElement = document.createElement('style');
		// styleElement.setAttribute('type', 'text/css');
        // styleElement.appendChild(document.createTextNode(this.settings.zenModeStyle))
		// header.append(styleElement);

		const iiZen = document.head.querySelector("#ii-zen");
		if(!iiZen) {
			document.head.appendChild(
				createEl("style", {
					attr: { id: "ii-zen" },
					text: this.settings.zenModeStyle,
					type: "text/css",
				})
			);
		}

		this.registerDomEvent(document, 'fullscreenchange', (event) => {
			if(!this.settings.zenMode) {
				return;
			}
			const body = document.body;
			if (document.fullscreenElement) {
				//进入禅模式
				body.addClass("ii-zen");
				zenSplits.forEach((item) => {
					body.querySelector(item)?.addClass("ii-zen");
				});
			} else {
				//退出禅模式
				body.removeClass("ii-zen");
				zenSplits.forEach((item) => {
					body.querySelector(item)?.removeClass("ii-zen");
				});
			}
		});

		// This adds a settings tab
		this.addSettingTab(new IISettingTab(this.app, this, statusBarItemEl));
	}

	onunload() {
		//卸载样式
		const iiZen = document.head.querySelector("#ii-zen");
		if(iiZen) {
			iiZen.remove();
		}
		console.log("unloading ii plugin");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	//设置光标位置
	setCursor(editor: Editor, num = 0) {
		const curserStart = editor.getCursor("from");
        const curserEnd = editor.getCursor("to");
		editor.setCursor(
			curserStart.line,
			curserEnd.ch + num || 0,
		);
	}

	//注册快速插入Markdown代码命令
	registerQuickInsertCommand() {

		//格式化颜色代码
		colors = this.settings.commonColors.split("\n").filter((item) => item !== "").map((item) => typeof item === 'string' ? item.trim() : item);

		//批量添加命令
		markdownCodes.forEach((item, index) => {
			this.addCommand({
				id: "ii-plugin-" + item.key,
				name: item.key.replace(/([a-z])([A-Z])/g, '$1 $2') + (this.settings.showChinese?`（${item.name}）`:''),
				editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) => {
					//只有开启快速插入模式，才添加命令
					//see https://docs.obsidian.md/Reference/TypeScript+API/Command/editorCheckCallback
					if (this.settings.quickInsert) {
						if (!checking) {
                            const selectVal = editor.getSelection();

							//处理H1,H2,H3,H4,H5,H6,Tag,Hr,Indent,List,OrderList,Task,Quote,Table
							const aloneCodes = ["H1", "H2", "H3", "H4", "H5", "H6", "Tag", "Hr", "Indent", "List", "OrderList", "Task", "Quote", "Table"];
							if(aloneCodes.includes(item.key)){
								editor.replaceSelection(item.code + selectVal);
							}


							//处理Bold,Italic,Strike,Highlight,UnderLine,Sup,Sub,Code,CodeBlock
							const wrapCodes = ["Bold", "Italic", "Strike", "Highlight", "UnderLine", "Sup", "Sub", "Code", "CodeBlock"];
							if(wrapCodes.includes(item.key)){
								editor.replaceSelection(item.code.replace("{}", selectVal));
								if(!selectVal && item.cursor) {
									this.setCursor(editor, item.cursor);
								}
							}

							//处理Color,BgColor
							if(['Color', 'BgColor'].includes(item.key)){
								if(this.settings.showColorPicker) {
									new ColorPickerModal(this.app, (color:string) => {
										const colorCode = item.code.replace("{1}", color).replace("{2}", selectVal);
										editor.replaceSelection(colorCode);
										if(!selectVal && item.cursor) {
											this.setCursor(editor, item.cursor);
										}
									}).open();
								} else {
									const colorCode = item.code.replace("{1}", '').replace("{2}", selectVal);
									editor.replaceSelection(colorCode);
									if(!selectVal && item.cursor) {
										this.setCursor(editor, item.cursor);
									}
								}
							}

							//处理Date,Time
							//see https://momentjs.com/docs/#/parsing/string-format/
							if(['Date', 'Time'].includes(item.key)){
								let tempDateTime = item.key;
								if(item.key === 'Date') {
									tempDateTime = this.settings.date || item.key;
								} else {
									tempDateTime = this.settings.time || item.key;
								}
								editor.replaceSelection(moment().format(tempDateTime));
							}

							//处理Link,Image ![{1}]({2} \"{3}\")
							if(['Link', 'Image'].includes(item.key)){
								const isShowTips = this.settings.showImgLinkTipText;
								const tipsText = isShowTips ? "LinkTitle" : "";
								const defText = "Link" === item.key ? tipsText: "";
								if(this.settings.showImgLinkDialog) {
									new DialogModal(this.app, item.key, selectVal, (val1: string, val2: string, val3: string, val4: string, val5: string)=> {
										if(val4 && "Image" === item.key) {
											if(this.settings.onlyStandardCode){
                                                editor.replaceSelection(`<img src="${val2}" alt="${val1}" title="${val3}" width="${val4}" height="${val5}" />`);
                                            } else {
												let alt = val1;
												if(val4 && val5){
													alt += "|" + val4 + "x" + val5;
												} else if(val4) {
													alt += "|" + val4;
												}
												editor.replaceSelection(item.code.replace("{1}", alt).replace("{2}", val2).replace("{3}", val3));
											}
										} else {
											editor.replaceSelection(item.code.replace("{1}", val1||selectVal||defText).replace("{2}", val2).replace("{3}", val3));
										}
									}).open();
								} else {
									editor.replaceSelection(item.code.replace("{1}", selectVal||defText).replace("{2}", isShowTips?'link':'').replace("{3}", isShowTips?'title':'').replace("{4}", ''));
									if(!selectVal && item.cursor) {
										this.setCursor(editor, item.cursor);
									}
								}
							}

							//处理Audio,Video,Iframe
							if(['Audio', 'Video', 'Iframe'].includes(item.key)){
								if(this.settings.showMediaDialog) {
									new DialogModal(this.app, item.key, selectVal, (val1: string, val2: string, val3: string, val4: string)=> {
										const replace = item.code.replace("{1}", val1).replace("{2}", val2).replace("{3}", val3).replace("{4}", val4)
										editor.replaceSelection(replace);
									}).open();
								} else {
									if(item.key === 'Audio') {
										editor.replaceSelection(item.code.replace("{1}", ''));
									} else {
										editor.replaceSelection(item.code.replace("{1}", '640').replace("{2}", '420').replace("{3}", '').replace("{4}", 'mp4'));
									}
								}
							}
						}
						return true;
					}
					return false;
				}
			});
		});
	}
}

/**
 * 	颜色选择器
 */
class ColorPickerModal extends Modal {
	callback: CallableFunction;
	color: string;
	constructor(app: App, callback: CallableFunction) {
		super(app);
		this.color = "#ffffff"; // 默认颜色
		this.callback = callback;
	}

	triggerCallback() {
		if (this.callback) this.callback(this.color);
		this.close();
	}

	onOpen() {
		const { contentEl } = this;
		//创建标题
		contentEl.createEl("h2", { text: "Choose a color" });

		const div = contentEl.createDiv();
		div.addClass("color-contain");

		//创建常用颜色块
		const colorDivs: HTMLDivElement[] = [];
		colors.forEach((color, index) => {
			colorDivs[index] = div.createDiv({ text: "" });
			colorDivs[index].setAttribute("title", `${color}`);
			colorDivs[index].addClass("color-item");
			colorDivs[index].style = `background:${color};`;
			colorDivs[index].onclick = () => {
				this.color = color;
				this.triggerCallback();
			};
		});

		const bottom = div.createDiv();
		bottom.addClass("color-bottom");
		//创建颜色选择按钮
		const more = bottom.createEl("button", { text: "" });
		more.addClass("color-more");
		more.onclick = () => {
			colorInput.click();
		};
		//创建颜色预览块
		const colorWrap = more.createSpan();
		colorWrap.setAttribute("title", this.color);
		colorWrap.addClass("color-wrap");
		colorWrap.style = `background:${this.color};`;
		const colorInput = colorWrap.createEl("input");
		//colorInput.style = 'visibility:hidden';
		colorInput.type = "color";
		colorInput.value = this.color;
		colorInput.onchange = (event) => {
			this.color = event.target.value;
			colorWrap.style.background = this.color;
			colorWrap.setAttribute("title", this.color);
			// 在这里处理颜色变更
			//this.triggerCallback()
		};
		//创建颜色选择按钮
		const moreText = more.createEl("span", { text: "🎨" });
		moreText.setAttribute("title", "More colors");
		moreText.addClass("color-more-text");

		//创建颜色选择OK按钮
		const okButton = bottom.createEl("button", { text: "OK" });
		okButton.setAttribute("title", 'Use this color');
		okButton.addClass("color-ok-btn");
		okButton.onclick = () => {
			this.triggerCallback();
		};

		setTimeout(() => {
			contentEl.addEventListener("keyup", (event) => {
				if (event.key === "Enter") {
					okButton.click();
				}
				if (event.key === "Escape") {
					this.close();
				}
			});
		}, 500);
	}
	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

/**
 * 	对话框面板
 */
class DialogModal extends Modal {
	callback: CallableFunction;
	val1: string;
	val2: string;
	val3: string;
	val4: string;
	val5: string;
	selection: string;
	type: string;
	constructor(app: App, type: string,  selection:string, callback: CallableFunction) {
		super(app);
		this.val1 = "";
		this.val2 = "";
		this.val3 = "";
		this.val4 = "";
		this.val5 = "";
		this.selection = selection;
		this.type = type;
		this.callback = callback;
	}

	triggerCallback() {
		if (this.callback) this.callback(this.val1, this.val2, this.val3, this.val4, this.val5);
		this.close();
	}

	onOpen() {
		const { contentEl } = this;

		/////////// create form /////////////////////////
		if (this.type === "Image") {
			this.createImageForm(contentEl)
		}

		if (this.type === "Link") {
			this.createLinkForm(contentEl)
		}

		if (this.type === "Audio") {
			this.createAudioForm(contentEl)
		}

		if (this.type === "Video") {
			this.createVideoForm(contentEl)
		}

		if (this.type === "Iframe") {
			this.createIframeForm(contentEl)
		}

		////////////////////// button /////////////////////////
		const split = contentEl.createEl("div");
		split.addClass("dlg-split");
		const okButton = contentEl.createEl("button", { text: "OK" });
		const cancelButton = contentEl.createEl("button", { text: "Cancel" });
		cancelButton.addClass("dlg-cancel-btn");
		cancelButton.onclick = () => {
			this.close();
		};
		okButton.onclick = () => {
			this.triggerCallback();
		}


		setTimeout(() => {
			contentEl.addEventListener("keyup", (event) => {
				if (event.key === "Enter") {
					okButton.click();
				}
				if (event.key === "Escape") {
					cancelButton.click();
				}
			});
		}, 500);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	//创建图片表单
	createImageForm(contentEl: HTMLElement) {
		this.createSource(contentEl, "val2", "Please input the image address");
		this.createWidthAndHeight(contentEl, "val4", "val5");
        this.createAltAndTitle(contentEl, "val1", "Please input the image alter", "val3", "Please input the image title");
	}

	//创建链接表单
	createLinkForm(contentEl: HTMLElement) {
		this.createSource(contentEl, "val2", "Please input the link address");
		this.createAltAndTitle(contentEl, "val1", "Please input the link name", "val3", "Please input the link title", "Must");
	}

	//创建音频表单
	createAudioForm(contentEl: HTMLElement) {
		this.createSource(contentEl, "val1", "Please input the audio address");
	}

	//创建视频表单
	createVideoForm(contentEl: HTMLElement) {
		this.createSource(contentEl, "val3", "Please input the video address");

		contentEl.createEl("div", { text: "Please select the type of the video" }).addClass("dlg-label");
		const dropdown = contentEl.createEl("select");
		dropdown.createEl("option", { text: "mp4", value: "mp4" });
		dropdown.createEl("option", { text: "ogg", value: "ogg" });
		dropdown.createEl("option", { text: "webm", value: "webm" });
		this.val4 = "mp4";
		dropdown.onchange = (event) => {
			this.val4 = event.target.value;
		};

		this.createWidthAndHeight(contentEl, "val1", "val2");
	}

	//创建iframe表单
	createIframeForm(contentEl: HTMLElement) {
		this.createSource(contentEl, "val3", "Please input the url address");
		this.createWidthAndHeight(contentEl, "val1", "val2");
	}

	createWidthAndHeight(contentEl: HTMLElement, wval:string, hval:string, title?:string) {
		contentEl.createEl("div", { text: title || "Please input the width and height" }).addClass("dlg-label");
		const wInput = contentEl.createEl("input");
		wInput.type = "number";
		wInput.placeholder = "Width optional";
		wInput.style.width = "120px";
		wInput.onchange = (event) => {
			this[wval] = event.target.value;
		};

        contentEl.createEl("span", { text: " x " });
		const hInput = contentEl.createEl("input");
		hInput.type = "number";
		hInput.placeholder = "Height optional";
		hInput.style.width = "120px";
		hInput.onchange = (event) => {
			this[hval] = event.target.value;
		};
	}

	createSource(contentEl: HTMLElement, val:string, title?:string) {
		contentEl.createEl("div", { text: title }).addClass("dlg-label");
		const input = contentEl.createEl("input");
		input.type = "text";
		input.style.width = "100%";
		input.onchange = (event) => {
			this[val] = event.target.value;
		};
	}

	createAltAndTitle(contentEl: HTMLElement, alt:string, altLabel:string, title:string, titleLabel:string, placeholder?:string) {
		contentEl.createEl("div", { text: altLabel }).addClass("dlg-label");
		const altInput = contentEl.createEl("input");
		altInput.placeholder=placeholder||"Optional";
		altInput.type = "text";
		altInput.onchange = (event) => {
			this[alt] = event.target.value;
		};

		contentEl.createEl("div", { text: titleLabel }).addClass("dlg-label");
		const titleInput = contentEl.createEl("input");
		titleInput.placeholder="Optional";
		titleInput.type = "text";
		titleInput.onchange = (event) => {
			this[title] = event.target.value;
		};
	}
}

/**
 * 	设置面板
 */
class IISettingTab extends PluginSettingTab {
	plugin: IIPlugin;
	statusBarItemEl: HTMLElement;

	constructor(app: App, plugin: IIPlugin, statusBarItemEl: HTMLElement) {
		super(app, plugin);
		this.plugin = plugin;
		this.statusBarItemEl = statusBarItemEl;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		//是否开启快速插入Markdown代码
		new Setting(containerEl).setName("Quick insert markdown code")
			.setDesc(
				"If enabled, you can use /ii to quickly insert Markdown code."
			).addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.quickInsert)
					.onChange(async (value) => {
						this.plugin.settings.quickInsert = value;
						await this.plugin.saveSettings();
						this.plugin.registerQuickInsertCommand();
					});
			});

		//开启显示文档占用空间
		new Setting(containerEl).setName("Show doc size in status")
			.setDesc("If enabled, the current document occupies space will be displayed in the status bar.")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showDocSize)
					.onChange(async (value) => {
						this.plugin.settings.showDocSize = value;
						this.statusBarItemEl.toggle(value);
						await this.plugin.saveSettings();
					});
			});

		//添加是否开启Zen模式
		new Setting(containerEl).setName("Zen mode")
			.setDesc("If enabled, when you execute a Zen command, the current document will be full-screen and the surrounding panels will be blocked.")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.zenMode)
					.onChange(async (value) => {
						this.plugin.settings.zenMode = value;
						await this.plugin.saveSettings();
					});
			});

		//添加是否显示中文提示
		new Setting(containerEl).setName("Show Chinese tips")
			.setDesc(
				"If enabled, the Chinese translation will be displayed on the right side of the command list."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showChinese)
					.onChange(async (value) => {
						this.plugin.settings.showChinese = value;
						await this.plugin.saveSettings();
						this.plugin.registerQuickInsertCommand();
					});
			});

		//添加是否弹出颜色选择面板
		new Setting(containerEl).setName("Show color picker modal")
			.setDesc(
				"If enabled, the color picker modal will be displayed when you click the color command."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showColorPicker)
					.onChange(async (value) => {
						this.plugin.settings.showColorPicker = value;
						await this.plugin.saveSettings();
					});
			});

		//添加常用颜色文本框
		new Setting(containerEl).setName("Common color codes")
			.setDesc("The color code here will be displayed in the color dialog modal, with each color code on a separate line.")
			.setClass("setting-color-codes")
			.addTextArea((textArea) => {
				textArea
					.setValue(this.plugin.settings.commonColors)
					.onChange(async (value) => {
						this.plugin.settings.commonColors = value;
						await this.plugin.saveSettings();
					});
			});

		//添加Image,Link是否弹出对话框面板
		new Setting(containerEl).setName("Show image and link modal")
			.setDesc(
				"If enabled, the dialog will be displayed when you click the link or image command."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showImgLinkDialog)
					.onChange(async (value) => {
						this.plugin.settings.showImgLinkDialog = value;
						await this.plugin.saveSettings();
					});
			});

		//添加是否弹出多媒体对话框面板
		new Setting(containerEl).setName("Show media modal")
			.setDesc(
				"If enabled, the dialog will be displayed when you click the audio, video, iframe command."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showMediaDialog)
					.onChange(async (value) => {
						this.plugin.settings.showMediaDialog = value;
						await this.plugin.saveSettings();
					});
			});

		//是否显示图片和链接的提示文字
		new Setting(containerEl).setName("Show tips in images and link code")
			.setDesc("If enabled, tips text will be added when inserting images or link code.")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showImgLinkTipText)
					.onChange(async (value) => {
						this.plugin.settings.showImgLinkTipText = value;
				});
			});

		//是否仅显示标准Markdown语法
		new Setting(containerEl).setName("Use only standard Markdown code")
			.setDesc("If enabled, only code in standard Markdown format will be generated.")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.onlyStandardCode)
					.onChange(async (value) => {
						this.plugin.settings.onlyStandardCode = value;
						await this.plugin.saveSettings();
					});
			});

		//添加日期格式
		new Setting(containerEl).setName("Date format")
			.setDesc("Date formatting codes, Y, M, D, d represent year, month, day, and week respectively.")
			.setClass("setting-date-format")
			.addText((text) => {
				text.setValue(this.plugin.settings.date).onChange(async (value) => {
					this.plugin.settings.date = value;
					await this.plugin.saveSettings();
				});
			});

		//添加时间格式
		new Setting(containerEl).setName("Time format")
			.setDesc("Time formatting codes, Y, M, D, H, m, s represent year, month, day, hour, minute, and second respectively.")
			.setClass("setting-time-format")
			.addText((text) => {
				text.setValue(this.plugin.settings.time).onChange(async (value) => {
					this.plugin.settings.time = value;
				});
			});

		//添加Zen模式样式
		let zenTimer = null;
		new Setting(containerEl).setName("Zen mode style")
			.setDesc("The style of the Zen mode.")
			.setClass("setting-zen-mode-style")
			.addTextArea((textArea) => {
				textArea
					.setValue(this.plugin.settings.zenModeStyle)
					.onChange(async (value) => {
						this.plugin.settings.zenModeStyle = value;
						await this.plugin.saveSettings();

						//修改禅模式样式
						if (zenTimer) {
							clearTimeout(zenTimer);
						}
						zenTimer = setTimeout(() => {
							const iiZen = document.head.querySelector("#ii-zen");
							if (iiZen) {
								iiZen.remove();
							}
							document.head.appendChild(
								createEl("style", {
									attr: { id: "ii-zen" },
									text: value,
									type: "text/css",
								})
							);
						}, 100);
					});
			});
	}
}
