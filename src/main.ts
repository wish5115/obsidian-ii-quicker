import { DocSize } from "src/feature/DocSize";
import { IISettingTab, IIPluginSettings, DEFAULT_SETTINGS } from "src/ui/Settings";
import { ColorPickerModal } from "src/ui/ColorPicker";
import { QuickInsert } from "src/feature/QuickInsert";
import { Zen, ZenMode } from "src/feature/Zen";
import { statusBarDragCode } from "src/config/config";
import { t } from "src/lang/helpers";
import {
	Editor,
	MarkdownView,
	Plugin,
	Platform,
	Notice,
	moment,
	setIcon,
} from "obsidian";

export const PLUGIN_ID = "ii-plugin";

export default class IIPlugin extends Plugin {
	settings: IIPluginSettings;
	isCN: boolean = moment.locale() === "zh-cn";
	isMobile: boolean = Platform.isMobileApp;
	zenLighting = false;
	zenSlighting = false;

	async onload() {
		//console.log("loading ii plugin");

		await this.loadSettings();

		//注册快速插入Markdown代码命令
		this.registerQuickInsertEvent();

		if(!this.isMobile){
			//状态栏显示当前文件大小
			new DocSize(this).watchDocChange();

			//注册颜色面板命令
			this.registerColorPanelCommand();

			//禅模式
			this.registerZenModeCommand();

			//轻禅模式
			this.registerZenModeLightCommand();

			//微禅模式
			this.registerZenModeSlightCommand();

			//预置样式
			this.addPreStyle();

			//执行代码片段
			this.runCodeSnippets();

			// 添加状态栏拖动代码
			this.addStatusDragCode();

			// 添加设置最小化
			this.addSettingsMinimize();
		}

		// This adds a settings tab
		this.addSettingTab(new IISettingTab(this.app, this));
	}

	onunload() {

		if(!this.isMobile){
			//卸载样式
			this.delPreStyle();

			//卸载代码片段
			this.delCodeSnippets();

			// 卸载状态栏拖动代码
			this.delStatusDragCode();
		}

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
		if(this.isMobile) {
			new QuickInsert(this)
			.registerQuickInsertCommand();
		} else {
			new QuickInsert(this)
			.registerQuickInsertCommand()
			.registerSearchInBrowserCommand()
			.registerContextMenu();
		}
	}

	//注册颜色面板命令
	registerColorPanelCommand() {
		this.addCommand({
			id: "own:color-panel",
			name: "Color panel" + (this.isCN?`（颜色面板）`:''),
			editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) => {
				if (this.settings.quickInsert) {
					if (!checking) {
						new ColorPickerModal(this.app, this, (color:string) => {
							editor.replaceSelection(color);
						}).open();
					}
					return true;
				}
				return false;
			},
		});
	}

	//注册禅模式(深度禅模式)命令
	registerZenModeCommand() {
		if(this.isMobile) return;
		this.addCommand({
			id: "own:zen",
			name: "Zen" + (this.isCN?`（禅模式）`:''),
			checkCallback: (checking: boolean) => {
				if (this.settings.zenMode) {
					if (!checking) {
						if (this.isMobile) {
							new Notice(t("Mobile devices are not supported at this time"));
							return
                        }
						if(!document.fullscreenElement) {
							//document.body.requestFullscreen();
							new Zen(this).fullscreen(ZenMode.Deep);
						} else {
							document.exitFullscreen();
						}
					}
					return true;
				}
				return false;
			},
		});
	}

	//注册轻禅命令
	registerZenModeLightCommand() {
		if(this.isMobile) return;
		this.addCommand({
			id: "own:zen-light",
			name: "Zen light" + (this.isCN?`（轻禅模式）`:''),
			checkCallback: (checking: boolean) => {
				if (this.settings.zenModeLight) {
					if (!checking) {
						if (this.isMobile) {
							new Notice(t("Mobile devices are not supported at this time"));
							return
                        }
						const zen = new Zen(this);
						if(!this.zenLighting) {
							zen.fullscreen(ZenMode.Light);
						} else {
							zen.exitFullscreen(ZenMode.Light);
						}
					}
					return true;
				}
				return false;
			},
		});
	}

	//注册微禅命令
	registerZenModeSlightCommand() {
		if(this.isMobile) return;
		this.addCommand({
			id: "own:zen-slight",
			name: "Zen slight" + (this.isCN?`（微禅模式）`:''),
			checkCallback: (checking: boolean) => {
				if (this.settings.zenModeSlight) {
					if (!checking) {
						if (this.isMobile) {
							new Notice(t("Mobile devices are not supported at this time"));
							return
                        }
						const zen = new Zen(this);
						if(!this.zenSlighting) {
							zen.fullscreen(ZenMode.Slight);
						} else {
							zen.exitFullscreen(ZenMode.Slight);
						}
					}
					return true;
				}
				return false;
			},
		});
	}

	//预置样式
	addPreStyle() {
		if(this.isMobile) return;
		const iiZen = document.head.querySelector("#ii-style");
		if(!iiZen) {
			document.head.appendChild(
				createEl("style", {
					attr: { id: "ii-style" },
					text: this.settings.styleCodes,
					type: "text/css",
				})
			);
		}
	}

	//卸载样式
	delPreStyle() {
		const iiZen = document.head.querySelector("#ii-style");
		if(iiZen) {
			iiZen.remove();
		}
	}

	//运行代码片段
	runCodeSnippets() {
		if(this.isMobile) return;
		const iiCode = document.body.querySelector("#ii-code");
		if(!iiCode && this.settings.codeSnippets) {
			document.body.appendChild(
				createEl("script", {
					attr: { id: "ii-code" },
					text: "(()=>{\n" + this.settings.codeSnippets + "\n})()",
					type: "text/javascript",
				})
			);
		}
	}

	//删除代码片段
	delCodeSnippets() {
		const iiCode = document.body.querySelector("#ii-code");
		if(iiCode) {
			iiCode.remove();
		}
	}

	addStatusDragCode() {
		if(this.isMobile) return;
		if(!this.settings.statusCanDragged) return;
		const iiCode = document.body.querySelector("#ii-status-drag");
		if(!iiCode && statusBarDragCode) {
			//@ts-ignore
			global.iiStatusEnableDrag = true;

			//插入代码
			document.body.appendChild(
				createEl("script", {
					attr: { id: "ii-status-drag" },
					text: "(()=>{\n" + statusBarDragCode + "\n})()",
					type: "text/javascript",
				})
			);
		}
	}

	//删除代码片段
	delStatusDragCode() {
		const iiCode = document.body.querySelector("#ii-status-drag");
		if(iiCode) {
			//@ts-ignore
			global.iiStatusEnableDrag = false;
			//@ts-ignore
			global.iiRecoveryStatusBar();

			iiCode.remove();

			// 取消事件监听
			//@ts-ignore
			global.iiRemoveStatusDragEvents();
		}
	}

	// 添加设置最小化按钮
	private obSettingBtnCallback: () => void;
	private boundObSettingBtnCallback: () => void;
	addSettingsMinimize(listen = true) {
		if(listen && !this.settings.showMinButton) return;
		const getSvgEl = () => {
			const svgSelector1 = ".side-dock-settings .lucide-settings"
			const svgSelector2 = ".side-dock-settings > .side-dock-ribbon-action:nth-child(3) > svg"
			let settingSvg = document.querySelector(svgSelector1)
			if (!settingSvg) {
				settingSvg = document.querySelector(svgSelector2)
			}
			return settingSvg
		}
		ready(async () => {
			// 等待元素加载完成
			let settingSvg = getSvgEl()
			// eslint-disable-next-line no-constant-condition
			while (true) {
				if(settingSvg){
					break;
				}
				await sleep(500);
				settingSvg = getSvgEl()
			}
			const obSettingBtn = settingSvg?.parentElement
			if(!obSettingBtn) return;
			// 给设置按钮绑定点击事件
			let settingsContainerDisplay = ""
			const addMinButton = () => {
				// 如果尚不存在最小化按钮则添加
				const settings = document.querySelector(".mod-settings");
				if(!settings) return
				const obMinBtn = document.querySelector(".ob-settings-minimize-btn");
				if(obMinBtn) return
				setTimeout(() => {
					const settings = document.querySelector(".mod-settings");
					//添加提示文字
					const newMinTips = createEl("span", {
						attr: { class: "ob-settings-minimize-tips" },
						text: t("Note: During minimization, can't open modal windows, such as control panels."),
					});
					settings?.prepend(newMinTips)

					// 添加最小化按钮
					const newMinBtn = createEl("div", {
						attr: { class: "ob-settings-minimize-btn" },
						//text: "-",
					});
					// 最小化按钮事件
					newMinBtn.onclick = () => {
						//点击最小化按钮，把设置对话框隐藏
						settingsContainerDisplay = getComputedStyle(settings?.parentElement as Element, null).getPropertyValue("display");
						settings?.parentElement?.find(".modal-bg").hide();
						settings?.addClass("ii-ob-settings-hide");
						setTimeout(() => {
							settings?.parentElement?.setAttr('style', 'display:none;')
							settings?.removeClass("ii-ob-settings-hide");
							settings?.parentElement?.find(".modal-bg").show();
						}, 600);
						setTimeout(() => {
							// 修改设置按钮的图标
							// const maxSvg = createEl("span", {
							// 	attr: { class: "svg-icon lucide-settings" },
							// 	text: `↗️`,
							// })
							// obSettingBtn.replaceChildren(maxSvg)
							setIcon(obSettingBtn, "arrow-up-right");
						}, 300);
					}
					settings?.prepend(newMinBtn)
				});
			};
			addMinButton();
			// @ts-ignore
			this.obSettingBtnCallback = () => {
				if(!this.settings.showMinButton) return;
				// 如果当前设置对话框是最小化状态（隐藏）则恢复
				const settings = document.querySelector(".mod-settings");
				if(settings && settings?.parentElement) {
					const settingsStyle = settings?.parentElement.getAttr('style');
					if(settingsStyle && settingsStyle?.indexOf("display:none") !== -1) {
						settings?.parentElement?.setAttr('style', `display:${settingsContainerDisplay};`)
						obSettingBtn.replaceChildren(settingSvg as Node)
						return
					}
				}
				// 如果尚不存在最小化按钮则添加
				addMinButton();
			}

			if(listen) {
				// 这里可以这样传参，this.obSettingBtnCallback.bind(this, a, b, c)
				this.boundObSettingBtnCallback = this.obSettingBtnCallback.bind(this)
				this.registerDomEvent(obSettingBtn as HTMLElement, 'click', this.boundObSettingBtnCallback)
				//obSettingBtn.addEventListener('click', this.boundObSettingBtnCallback);
			} else {
				obSettingBtn.replaceChildren(settingSvg as Node);
				document.querySelector(".ob-settings-minimize-btn")?.remove();
				document.querySelector(".ob-settings-minimize-tips")?.remove();
				obSettingBtn.removeEventListener('click', this.boundObSettingBtnCallback);
			}
		});
	}

	// 删除设置最小化按钮
	delSettingsMinimize() {
		this.addSettingsMinimize(false)
	}
}

