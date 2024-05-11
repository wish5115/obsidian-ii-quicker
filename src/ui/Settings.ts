import {
	App,
	PluginSettingTab,
	Setting,
} from "obsidian";

import {colors, markdownCodes, defContextCodes} from "src/config/config";
import IIPlugin from "src/main";
import { QuickInsert } from "src/feature/QuickInsert";
import { t } from "src/lang/helpers";


export interface IIPluginSettings {
	quickInsert: boolean;
	showColorPicker: boolean;
	showImgLinkDialog: boolean;
	showMediaDialog: boolean;
	showImgLinkTipText: boolean;
	commonColors: string;
	date: string;
	time: string;
	onlyStandardCode: boolean;
	allowCodeList: Array<string>;
	subMenus: Array<string>;
	showCommandMenu: boolean;
	customCodes: string;
}

export const DEFAULT_SETTINGS: IIPluginSettings = {
	quickInsert: true,
	showColorPicker: true,
	showImgLinkDialog: false,
	showMediaDialog: false,
	showImgLinkTipText: false,
	commonColors: colors.join("\n"),
	date: "YYYY-MM-DD ddd",
	time: "YYYY-MM-DD HH:mm:ss",
	onlyStandardCode: false,
	allowCodeList: markdownCodes.map((item) => item.key),
	subMenus: defContextCodes,
	showCommandMenu: true,
	customCodes: "",
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