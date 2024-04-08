import {
	IISettingTab,
	IIPluginSettings,
	DEFAULT_SETTINGS,
} from "src/ui/Settings";
import { ColorPickerModal } from "src/ui/ColorPicker";
import { QuickInsert } from "src/feature/QuickInsert";
import {
	Editor,
	MarkdownView,
	Plugin,
	Platform,
	moment,
} from "obsidian";

export const PLUGIN_ID = "ii-quicker";

export default class IIPlugin extends Plugin {
	settings: IIPluginSettings;
	isCN: boolean = moment.locale() === "zh-cn";
	isMobile: boolean = Platform.isMobileApp;

	async onload() {
		//console.log("loading ii plugin");

		await this.loadSettings();

		//注册快速插入Markdown代码命令
		this.registerQuickInsertEvent();

		//注册颜色面板命令
		this.registerColorPanelCommand();

		// This adds a settings tab
		this.addSettingTab(new IISettingTab(this.app, this));
	}

	onunload() {

		//console.log("unloading ii plugin");
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

	//注册快速插入Markdown代码命令和注册右键菜单
	registerQuickInsertEvent() {
		if(!this.settings.quickInsert) return;
		new QuickInsert(this)
			.registerQuickInsertCommand()
			.registerContextMenu();
	}

	//注册颜色面板命令
	registerColorPanelCommand() {
		this.addCommand({
			id: "own:color-panel",
			name: "Color panel" + (this.isCN ? `（颜色面板）` : ""),
			editorCheckCallback: (
				checking: boolean,
				editor: Editor,
				view: MarkdownView
			) => {
				if (this.settings.quickInsert) {
					if (!checking) {
						new ColorPickerModal(
							this.app,
							this,
							(color: string) => {
								editor.replaceSelection(color);
							}
						).open();
					}
					return true;
				}
				return false;
			},
		});
	}
}
