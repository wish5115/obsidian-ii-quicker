import {
	App,
	PluginSettingTab,
	Setting,
} from "obsidian";

import {colors, zenModeDefaultStyle, markdownCodes, defContextCodes} from "src/config/config";
import IIPlugin from "src/main";
import { DocSize } from "src/feature/DocSize";
import { QuickInsert } from "src/feature/QuickInsert";
import { t } from "src/lang/helpers";


export interface IIPluginSettings {
	quickInsert: boolean;
	showDocSize:boolean;
	zenMode: boolean;
	showColorPicker: boolean;
	showImgLinkDialog: boolean;
	showMediaDialog: boolean;
	showImgLinkTipText: boolean;
	commonColors: string;
	date: string;
	time: string;
	styleCodes: string;
	onlyStandardCode: boolean;
	allowCodeList: Array<string>;
	zenModeLight: boolean;
	zenModeSlight: boolean;
	subMenus: Array<string>;
	showCommandMenu: boolean;
	customCodes: string;
	codeSnippets: string;
	showSearchInBrowser: boolean;
	searchUrl: string;
	statusCanDragged: boolean;
	showMinButton: boolean;
	storeStatusDraggedPos: boolean;
	showFileCopyPathContextMenu: boolean;
}

export const DEFAULT_SETTINGS: IIPluginSettings = {
	quickInsert: true,
	showDocSize: true,
	zenMode: true,
	showColorPicker: true,
	showImgLinkDialog: false,
	showMediaDialog: false,
	showImgLinkTipText: false,
	commonColors: colors.join("\n"),
	date: "YYYY-MM-DD ddd",
	time: "YYYY-MM-DD HH:mm:ss",
	styleCodes: zenModeDefaultStyle,
	onlyStandardCode: false,
	allowCodeList: markdownCodes.map((item) => item.key),
	zenModeLight: true,
	zenModeSlight: true,
	subMenus: defContextCodes,
	showCommandMenu: true,
	customCodes: "",
	codeSnippets: "",
	showSearchInBrowser: true,
	searchUrl: "https://bing.com/search?q={selection}",
	statusCanDragged: false,
	showMinButton: false,
	storeStatusDraggedPos: true,
	showFileCopyPathContextMenu: true,
};

/**
 * 	设置面板
 */
export class IISettingTab extends PluginSettingTab {
	plugin: IIPlugin;

	constructor(app: App, plugin: IIPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		//是否开启快速插入Markdown代码
		new Setting(containerEl).setName(t("Quick insert markdown code"))
			.setDesc(
				t("If enabled, you can use /ii to quickly insert Markdown code.")
			).addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.quickInsert)
					.onChange(async (value) => {
						this.plugin.settings.quickInsert = value;
						await this.plugin.saveSettings();
					});
			});

		//添加是否开启Deep Zen模式
		new Setting(containerEl).setName(t("Zen mode deep"))
			.setDesc(t("If enabled, when you toggle a Zen command, the active document will be full-screen and the surrounding views will be hidden."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.zenMode)
					.onChange(async (value) => {
						this.plugin.settings.zenMode = value;
						await this.plugin.saveSettings();
					});
			});

		//添加是否开启Light Zen模式
		new Setting(containerEl).setName(t("Zen mode light"))
			.setDesc(t("If enabled, when you toggle a Zen light command, the active document will be full-window and the surrounding views will be hidden."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.zenModeLight)
					.onChange(async (value) => {
						this.plugin.settings.zenModeLight = value;
						await this.plugin.saveSettings();
					});
			});

		//添加是否开启Slight Zen模式
		new Setting(containerEl).setName(t("Zen mode slight"))
			.setDesc(t("If enabled, when you toggle a Zen command, the surrounding views will be hidden."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.zenModeSlight)
					.onChange(async (value) => {
						this.plugin.settings.zenModeSlight = value;
						await this.plugin.saveSettings();
					});
			});

		// 是否开启菜单
		new Setting(containerEl).setName(t("Show command in context menu"))
			.setDesc(t("If enabled, the command context menu will be displayed when you right-click."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showCommandMenu)
					.onChange(async (value) => {
						this.plugin.settings.showCommandMenu = value;
						await this.plugin.saveSettings();
					});
				});

		//开启显示文档占用空间
		new Setting(containerEl).setName(t("Show doc size in status"))
			.setDesc(t("If enabled, the current document occupies space will be displayed in the status bar."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showDocSize)
					.onChange(async (value) => {
						this.plugin.settings.showDocSize = value;
                        new DocSize(this.plugin).toggle(value);
						//this.statusBarItemEl.toggle(value);
						await this.plugin.saveSettings();
					});
			});

		// 是否开启浏览器搜索
		new Setting(containerEl).setName(t("Show search in browser"))
			.setDesc(t("If enabled, it will search for the keywords you selected in the browser, through the context menu."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showSearchInBrowser)
					.onChange(async (value) => {
						this.plugin.settings.showSearchInBrowser = value;
						await this.plugin.saveSettings();
					});
			});

		// 用浏览器搜索
		new Setting(containerEl).setName(t("Search in browser search engine"))
			.setDesc(t("What search engine to use, when you right-click to search. {selection} means search keyword."))
			.setClass("settings-search-url")
			.addText((text) => {
				text
					.setValue(this.plugin.settings.searchUrl)
					.onChange(async (value) => {
						this.plugin.settings.searchUrl = value;
						await this.plugin.saveSettings();
					});
			})

		// 文件菜单右键复制文件路径
        new Setting(containerEl).setName(t("Copy file path right-click menu"))
			.setDesc(t("When enabled, the \"Copy File Path\" function will be displayed in the right-click menu of the file."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showFileCopyPathContextMenu)
					.onChange(async (value) => {
						this.plugin.settings.showFileCopyPathContextMenu = value;
						await this.plugin.saveSettings();
					});
			});

		//添加是否弹出颜色选择面板
		new Setting(containerEl).setName(t("Show color picker modal"))
			.setDesc(t("If enabled, the color picker modal will be displayed when you click the color command."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showColorPicker)
					.onChange(async (value) => {
						this.plugin.settings.showColorPicker = value;
						await this.plugin.saveSettings();
					});
			});

		//添加常用颜色文本框
		new Setting(containerEl).setName(t("Common color codes"))
			.setDesc(t("The color code here will be displayed in the color dialog modal, with each color code on a separate line."))
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
		new Setting(containerEl).setName(t("Show image and link modal"))
			.setDesc(t("If enabled, the dialog will be displayed when you click the link or image command."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showImgLinkDialog)
					.onChange(async (value) => {
						this.plugin.settings.showImgLinkDialog = value;
						await this.plugin.saveSettings();
					});
			});

		//添加是否弹出多媒体对话框面板
		new Setting(containerEl).setName(t("Show media modal"))
			.setDesc(t("If enabled, the dialog will be displayed when you click the audio, video, iframe command."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showMediaDialog)
					.onChange(async (value) => {
						this.plugin.settings.showMediaDialog = value;
						await this.plugin.saveSettings();
					});
			});

		//是否显示图片和链接的提示文字
		new Setting(containerEl).setName(t("Show tips in images and link code"))
			.setDesc(t("If enabled, tips text will be added when inserting images or link code."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showImgLinkTipText)
					.onChange(async (value) => {
						this.plugin.settings.showImgLinkTipText = value;
				});
			});

		//是否仅显示标准Markdown语法
		new Setting(containerEl).setName(t("Use only standard Markdown code"))
			.setDesc(t("If enabled, only code in standard Markdown format will be generated."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.onlyStandardCode)
					.onChange(async (value) => {
						this.plugin.settings.onlyStandardCode = value;
						await this.plugin.saveSettings();
					});
			});

		// 状态栏是否可以拖动
		const statusDragSetting = new Setting(containerEl)
			.setName(t("Status bar can drag"))
			.setDesc(t("If enabled, the status bar can be dragged."))
			.setClass("settings-status-drag")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.statusCanDragged)
					.onChange(async (value) => {
						this.plugin.settings.statusCanDragged = value;
						await this.plugin.saveSettings();
						if(value) {
							this.plugin.addStatusDragCode();
						} else {
							this.plugin.delStatusDragCode();
						}
					});
			});
			const statusDragCheckbox = statusDragSetting.controlEl
				.createEl("label", { text: t("Remember dragged position")})
				.createEl("input", { type: "checkbox" })
			statusDragCheckbox.checked = this.plugin.settings.storeStatusDraggedPos;
			if (statusDragCheckbox.checked) {
				localStorage.setItem("ii-status-bar-remember", "1");
			}
			statusDragCheckbox.onchange = async (e) => {
				if (statusDragCheckbox.checked) {
					this.plugin.settings.storeStatusDraggedPos = true;
					localStorage.setItem("ii-status-bar-remember", "1");
					//@ts-ignore
					global.iiStatusBarStorePosition();
				} else {
					this.plugin.settings.storeStatusDraggedPos = false;
					localStorage.setItem("ii-status-bar-remember", "");
				}
				await this.plugin.saveSettings();
			}

		// ob设置面板添加最小化按钮
		new Setting(containerEl).setName(t("Add minimize button to settings panel"))
			.setDesc(t("If enabled, will add a minimize button in obsidian's settings panel."))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.showMinButton)
					.onChange(async (value) => {
						this.plugin.settings.showMinButton = value;
						await this.plugin.saveSettings();
						if(value) {
							this.plugin.addSettingsMinimize();
						} else {
							this.plugin.delSettingsMinimize();
						}
					});
			});

		//添加日期格式
		new Setting(containerEl).setName(t("Date format"))
			.setDesc(t("Date formatting codes, Y, M, D, d represent year, month, day, and week respectively."))
			.setClass("setting-date-format")
			.addText((text) => {
				text.setValue(this.plugin.settings.date).onChange(async (value) => {
					this.plugin.settings.date = value;
					await this.plugin.saveSettings();
				});
			});

		//添加时间格式
		new Setting(containerEl).setName(t("Time format"))
			.setDesc(t("Time formatting codes, Y, M, D, H, m, s represent year, month, day, hour, minute, and second respectively."))
			.setClass("setting-time-format")
			.addText((text) => {
				text.setValue(this.plugin.settings.time).onChange(async (value) => {
					this.plugin.settings.time = value;
				});
			});

		//添加样式代码
		let styleTimer: NodeJS.Timeout | null = null;
		new Setting(containerEl).setName(t("Style codes"))
			.setDesc(t("The style of the Zen mode and others."))
			.setClass("setting-style-codes")
			.addTextArea((textArea) => {
				textArea
					.setValue(this.plugin.settings.styleCodes)
					.onChange(async (value) => {
						this.plugin.settings.styleCodes = value;
						await this.plugin.saveSettings();

						//修改样式
						if (styleTimer) {
							clearTimeout(styleTimer);
						}
						styleTimer = setTimeout(() => {
							this.plugin.delPreStyle();
							this.plugin.addPreStyle();
						}, 100);
					});
			});

		//添加markdown代码复选框列表
		const codeControlEl = new Setting(containerEl).setName(t("Choose which codes enable"))
			.setDesc(t("Only the code you checked is added to the list of commands."))
			.controlEl;
		//创建markdown代码复选框列表
		this.createCheckList(codeControlEl, "allowCodeList");

		//添加右键菜单复选框列表
		const menuControlEl = new Setting(containerEl).setName(t("Choose which show in context menu"))
			.setDesc(t("Only the code you checked is added to the list of context menu."))
			.controlEl;
		//创建右键菜单复选框列表
		this.createCheckList(menuControlEl, "subMenus");


		//添加自定义格式
		const customDescNode = document.createElement('div')
		customDescNode.addClass('settings-custom-code-desc');
		const customDescT = t("settings.customCodeDesc");
		customDescT.split('\n').forEach(item => customDescNode.createEl('div', {text: item}))
		const customDescFragment = document.createDocumentFragment()
		customDescFragment.append(customDescNode)
		let customCodeTimer: NodeJS.Timeout | null = null;
		new Setting(containerEl).setName(t("Custom codes"))
			.setDesc(customDescFragment)
			.setClass("setting-custom-code")
			.addTextArea((textArea) => {
				textArea
					.setValue(this.plugin.settings.customCodes)
					.setPlaceholder(t("Format: \nName::Code::menu\n\nExample: \nMy Link::<a href=\"{cursor}\">{selection}</a>::menu"))
					.onChange(async (value) => {
						this.plugin.settings.customCodes = value;
						await this.plugin.saveSettings();
						if (customCodeTimer) {
							clearTimeout(customCodeTimer);
						}
						customCodeTimer = setTimeout(()=>{
							new QuickInsert(this.plugin).updateCustomCodesCommand();
							//new QuickInsert(this.plugin).registerCustomCodesCommand();
							//console.log('ii-plugin custom command Re-registered.');
						}, 3000);
					});
			});

		// 执行代码片段
		let codeTimer: NodeJS.Timeout | null = null;
		new Setting(containerEl).setName(t("Javascript code snippets"))
			.setDesc(t("The javascript code snippets will be executed when the plugin is loaded."))
			.setClass("setting-code-snippets")
			.addTextArea((textArea) => {
				textArea
					.setValue(this.plugin.settings.codeSnippets)
					.setPlaceholder(t("You can open the devtools console to debug as you write.\nExample:\nconsole.log('Nice day!')"))
					.onChange(async (value) => {
						this.plugin.settings.codeSnippets = value;
						await this.plugin.saveSettings();

						//更新代码片段
						if (codeTimer) {
							clearTimeout(codeTimer);
						}
						codeTimer = setTimeout(() => {
							this.plugin.delCodeSnippets();
							this.plugin.runCodeSnippets();
						}, 1000);
					});
			});

	}

	//创建checklist列表
	createCheckList(controlEl: HTMLElement, allowList: keyof IIPluginSettings & ('allowCodeList' | 'subMenus')) {
		const codeList = controlEl.createDiv();
		codeList.addClass("settings-checkbox-list");
		markdownCodes.forEach(item => {
			const checkbox = codeList.createEl("label", { text: this.plugin.isCN?item.name:item.key}).createEl("input", { type: "checkbox", value: item.key })
			if(checkbox) {
				checkbox.checked = this.plugin.settings[allowList].includes(item.key);
				checkbox.onchange = async () => {
					if(checkbox.checked) {
						if(!this.plugin.settings[allowList].includes(checkbox.value)) {
							this.plugin.settings[allowList].push(checkbox.value);
						}
					} else {
						this.plugin.settings[allowList] = this.plugin.settings[allowList].filter(item => item !== checkbox.value);
					}
					//去重
					//this.plugin.settings.allowCodeList = Array.from(new Set(this.plugin.settings.allowCodeList));
					await this.plugin.saveSettings();
				}
			}
		});
	}
}