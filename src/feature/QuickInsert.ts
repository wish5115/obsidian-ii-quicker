/* eslint-disable no-mixed-spaces-and-tabs */
import { markdownCodes } from "src/config/config"
import IIPlugin, { PLUGIN_ID } from "src/main";
import { Editor, MarkdownView, Menu, MenuItem, Notice, moment } from "obsidian";
import { ColorPickerModal } from "src/ui/ColorPicker";
import { DialogModal } from "src/ui/Dialog";
import { setCursor } from "../utils/common";
import { t } from "src/lang/helpers";

type MarkdownCode = {
	key: string;
	name: string;
	code: string;
	cursor?: number;
};

export class QuickInsert{

    plugin: IIPlugin;

    constructor(plugin: IIPlugin) {
        this.plugin = plugin;
    }

    //注册快速插入Markdown代码命令
	registerQuickInsertCommand() {
		//批量添加命令
		markdownCodes.forEach((item, index) => {
			this.plugin.addCommand({
				id: "own:" + item.key.replace(/\s+/g, "-").toLowerCase(),
				name: item.key + (this.plugin.isCN?`（${item.name}）`:''),
				//name: item.key.replace(/([a-z])([A-Z])/g, '$1 $2') + (this.plugin.isCN?`（${item.name}）`:''),
				editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) => {
					//只有开启快速插入模式，才添加命令
					//see https://docs.obsidian.md/Reference/TypeScript+API/Command/editorCheckCallback
					if (this.plugin.settings.quickInsert && this.plugin.settings.allowCodeList.includes(item.key)) {
						if (!checking) {
							this.dealMarkdownCodes(item, editor, view);
						}
						return true;
					}
					return false;
				}
			});
		});

		//插入用户自定义格式命令
		this.registerCustomCodesCommand();

		//插入清除格式
		this.plugin.addCommand({
			id: "own:clear-formatting",
			name: "Clear formatting" + (this.plugin.isCN?`（清除格式）`:''),
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();
				const isMultiLine = selection.includes("\n");
				let newVal = "";
				if(isMultiLine) {
					selection.split("\n").forEach((line) => {
						newVal += this.clearFormatting(line);
					});
					editor.replaceSelection(newVal);
					return
				}
				editor.replaceSelection(this.clearFormatting(selection).trim());
			},
		});

		return this;
	}

	// 用户自定义格式命令
	registerCustomCodesCommand() {
		const { customCodes } = this.plugin.settings;
		if(!customCodes) return
		const customCodesArr = customCodes.split("\n").filter((item) => item !== "").map((item) => typeof item === 'string' ? item.trim() : item);
		customCodesArr.forEach((line) => {
			if(line.startsWith("::")) return
			const [name, code] = line.split("::");
			if(!name || !`${name}`.trim() || !code || !`${code}`.trim()) return
			this.plugin.addCommand({
				id: "custom:" + name.trim().replace(/\s+/g, "-").toLowerCase(),
				name: "custom: " + name.trim(),
				editorCallback: (editor: Editor, view: MarkdownView) => {
					const selection = editor.getSelection();
					if(selection.trim().includes("\n")) {
						let newVal = "";
						selection.split("\n").forEach((line) => {
							const newText = code.replace('{selection}', line.trim())
							newVal += (line?newText.replace('{cursor}', ''):"")+"\n"
						})
						editor.replaceSelection(newVal.replace(/\n$/, ''));
						return
					}
					const newText = code.replace('{selection}', selection)
					const cursor = newText.indexOf("{cursor}") - newText.length + "{cursor}".length;
					editor.replaceSelection(newText.replace('{cursor}', ''));
					if(code.includes("{cursor}")) {
						this.setCursor(editor, cursor);
					}
				},
			});
		});
		return this;
	}

	//更新用户自定义命令
	// see https://forum.obsidian.md/t/add-possibility-of-removing-a-command/77455
	// see https://github.com/marcusolsson/obsidian-projects/blob/86ba1ddb6a858ea531346331f61bee6dcfb1e55c/src/main.ts#L234
	updateCustomCodesCommand() {
		const registeredCommandIds = new Set<string>(
			// @ts-ignore
			Object.keys(this.plugin.app.commands.commands).filter((id) => {
			    return id.startsWith(`${PLUGIN_ID}:custom:`)
	        })
		);
		registeredCommandIds.forEach((id) => {
			//@ts-ignore
			this.plugin.app.commands.removeCommand(id);
		});
		this.registerCustomCodesCommand();
	}

	// 注册右键菜单命令
	registerContextMenu() {
		// 添加右键菜单
		this.plugin.registerEvent(
			this.plugin.app.workspace.on("editor-menu", (menu: Menu, editor: Editor, view: MarkdownView) => {

				// 快速插入命令
				if(!this.plugin.settings.showCommandMenu){
					return
				}
				menu.addItem((item) => {
					item.setTitle("II-Quicker")
					    .setIcon("wand")
					    .onClick(async () => {
							new Notice("Please set up the submenu first");
					    });

					//@ts-ignore
					const subMenu = item?.setSubmenu();

					//批量添加子菜单
					if(this.plugin.settings.subMenus.length > 0) {
						markdownCodes.forEach((code) => {
							if(!this.plugin.settings.subMenus.includes(code.key)) {
								return //进行下一次循环
							}
							subMenu.addItem((sub: MenuItem) => {
								sub.setTitle(code.key + (this.plugin.isCN?`（${code.name}）`:''))
								//sub.setTitle(code.key.replace(/([a-z])([A-Z])/g, '$1 $2') + (this.plugin.isCN?`（${code.name}）`:''))
									.onClick(async () => {
										this.dealMarkdownCodes(code, editor, view, true);
									});
							});
						})

						//添加分割线
						//subMenu.addSeparator();
					}

					//添加清除格式菜单
					subMenu.addItem((sub: MenuItem) => {
						sub.setTitle('Clear formatting' + (this.plugin.isCN?`（清除格式）`:''))
							.onClick(async () => {
								const selection = editor.getSelection();
								const isMultiLine = selection.includes("\n");
								let newVal = "";
								if(isMultiLine) {
									selection.split("\n").forEach((line) => {
										newVal += this.clearFormatting(line);
									});
									editor.replaceSelection(newVal.replace(/\n$/, ''));
									return
								}
								editor.replaceSelection(this.clearFormatting(selection).replace(/\n$/, ''));
							});
					});

					// 用户自定义格式
					const { customCodes } = this.plugin.settings;
					if(!customCodes) return
					const customCodesArr = customCodes.split("\n").filter((item) => item !== "").map((item) => typeof item === 'string' ? item.trim() : item);
					let count = 0;
					customCodesArr.forEach((line, index) => {
						if(line.startsWith("::")) return
						const [name, code, showMenu] = line.split("::");
						if(!name || !`${name}`.trim() || !code || !`${code}`.trim() || !showMenu || !`${showMenu}`.trim()) return
						//添加分割线
						if (count++ === 0) subMenu.addSeparator();
						//添加子菜单
						subMenu.addItem((sub: MenuItem) => {
							sub.setTitle(name.trim())
								.onClick(async () => {
									const selection = editor.getSelection();
									if(selection.trim().includes("\n")) {
										let newVal = "";
										selection.split("\n").forEach((line) => {
											const newText = code.replace('{selection}', line.trim())
											newVal += (line?newText.replace('{cursor}', ''):"")+"\n"
										})
										editor.replaceSelection(newVal.replace(/\n$/, ''));
										return
									}
									const newText = code.replace('{selection}', selection.trim())
									const cursor = newText.indexOf("{cursor}") - newText.length + "{cursor}".length;
									editor.replaceSelection(newText.replace('{cursor}', '')+"\n");
									if(code.includes("{cursor}")) {
										this.setCursor(editor, cursor, -1);
									} else {
										this.setCursor(editor, 0, -1);
									}
								});
						});
					});

				})
			})
		)
		return this
	}

	// markdown代码处理函数
	private dealMarkdownCodes(item: MarkdownCode, editor: Editor, view: MarkdownView, contextMenu = false) {
		const selectVal = editor.getSelection();
		const isMultiLine = selectVal.includes("\n");
		const replaceMultiLine = (fn: CallableFunction, cursor = 0) => {
			if(!selectVal.trim()) {
				//兼容右键菜单
				editor.replaceSelection(fn("")+"\n");
				this.setCursor(editor, cursor||0, -1);
				return
			}
			let newVal = "";
			selectVal.split("\n").forEach((line) => {
				newVal += (line?fn(line):"") + "\n";
			});
			editor.replaceSelection(newVal.replace(/\n$/, ''));
		};

		//处理H1,H2,H3,H4,H5,H6,Tag,Hr,Indent,List,OrderList,Task,Quote,Table
		const aloneCodes = ["H1", "H2", "H3", "H4", "H5", "H6", "Tag", "Horizontal rule", "Indent", "Bullet list", "Numbered list", "Task list", "Quote", "Table", "Anchor", "Variables", "Footnotes", "Callout", "Image link", "Email", "PDF"];
		if(aloneCodes.includes(item.key)){
			if (isMultiLine) return replaceMultiLine((line: string) => item.code + line, item.cursor);
			editor.replaceSelection(item.code + selectVal);
		}


		//处理Bold,Italic,Strike,Highlight,UnderLine,Sup,Sub,Code,CodeBlock
		const wrapCodes = ["Bold", "Italic", "Strikethrough", "Highlight", "Underline", "Sup", "Sub", "Code", "Code block", "Align left", "Align right", "Align center", "Align justify", "Html comment", "Ob comment", "Math line", "Math block", "Wiki link", "Wiki image", "Block quote", "Block quote global"];
		if(wrapCodes.includes(item.key)){
			if(this.plugin.settings.onlyStandardCode) {item.code = "<mark>{}</mark>"; item.cursor = -7;}
			if (isMultiLine) return replaceMultiLine((line: string) => item.code.replace("{}", line), item.cursor);
			editor.replaceSelection(item.code.replace("{}", selectVal));
			if(!selectVal && item.cursor) {
				this.setCursor(editor, item.cursor);
			}
		}

		//处理Color,BgColor
		if(['Color', 'Background color'].includes(item.key)){
			if(this.plugin.settings.showColorPicker) {
				new ColorPickerModal(this.plugin.app, this.plugin, (color:string) => {
					if (isMultiLine) return replaceMultiLine((line: string) => item.code.replace("{1}", color).replace("{2}", line), item.cursor);
					const colorCode = item.code.replace("{1}", color).replace("{2}", selectVal);
					editor.replaceSelection(colorCode);
					if(!selectVal && item.cursor) {
						this.setCursor(editor, item.cursor);
					}
				}).open();
			} else {
				if (isMultiLine) return replaceMultiLine((line: string) => item.code.replace("{1}", '').replace("{2}", line), item.cursor);
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
				tempDateTime = this.plugin.settings.date || item.key;
			} else {
				tempDateTime = this.plugin.settings.time || item.key;
			}
			editor.replaceSelection(moment().format(tempDateTime));
		}

		//处理Link,Image ![{1}]({2} \"{3}\")
		if(['Link', 'Image'].includes(item.key)){
			const isShowTips = this.plugin.settings.showImgLinkTipText;
			const tipsText = isShowTips ? "LinkTitle" : "";
			const defText = "Link" === item.key ? tipsText: "";
			if(this.plugin.settings.showImgLinkDialog) {
				new DialogModal(this.plugin.app, item.key, selectVal.trim(), (val1: string, val2: string, val3: string, val4: string, val5: string)=> {
					const ln = contextMenu ? "\n" : "";
					if(val4 && "Image" === item.key) {
						if(this.plugin.settings.onlyStandardCode){
							editor.replaceSelection(`<img src="${val2}" alt="${val1}" title="${val3}" width="${val4}" height="${val5}" />`);
						} else {
							let alt = val1;
							if(val4 && val5){
								alt += "|" + val4 + "x" + val5;
							} else if(val4) {
								alt += "|" + val4;
							}
							const val = item.code.replace("{1}", alt).replace("{2}", val2).replace("{3}", val3);
							editor.replaceSelection(val+ln);
						}
					} else {
						const val = item.code.replace("{1}", val1||selectVal.trim()||defText).replace("{2}", val2).replace("{3}", val3)
						editor.replaceSelection(val+ln);
					}
					if(contextMenu) this.setCursor(editor, item.cursor || 0, -1);
				}).open();
			} else {
				if (isMultiLine) return replaceMultiLine((line: string) => item.code.replace("{1}", line||defText).replace("{2}", isShowTips?'link':'').replace("{3}", isShowTips?'title':'').replace("{4}", ''), item.cursor);
				const val = item.code.replace("{1}", selectVal||defText).replace("{2}", isShowTips?'link':'').replace("{3}", isShowTips?'title':'').replace("{4}", '')
				editor.replaceSelection(val);
				if(!selectVal && item.cursor) {
					this.setCursor(editor, item.cursor + (this.plugin.settings.showImgLinkTipText? -5 : 0));
				}
			}
		}

		//处理Audio,Video,Iframe
		if(['Audio', 'Video', 'Iframe'].includes(item.key)){
			if(this.plugin.settings.showMediaDialog) {
				new DialogModal(this.plugin.app, item.key, selectVal.trim(), (val1: string, val2: string, val3: string, val4: string)=> {
					const replace = item.code.replace("{1}", val1).replace("{2}", val2).replace("{3}", val3).replace("{4}", val4)
					const ln = contextMenu ? "\n" : "";
					editor.replaceSelection(replace + ln);
					if(contextMenu) this.setCursor(editor, item.cursor || 0, -1);
				}).open();
			} else {
				if(item.key === 'Audio') {
					editor.replaceSelection(item.code.replace("{1}", ''));
				} else {
					editor.replaceSelection(item.code.replace("{1}", '640').replace("{2}", '420').replace("{3}", '').replace("{4}", 'mp4'));
				}
				if(!selectVal && item.cursor) {
					this.setCursor(editor, item.cursor);
				}
			}
		}
	}

    setCursor(editor: Editor, num = 0, row = 0) {
        return setCursor(editor, num, row);
    }


	// 清除格式函数
	clearFormatting(line: string) {
		//清除h1-h6和标签
		line = line.replace(/^#{1,6}\s?/, "");
		//清除代码块和分割线
		line = line.replace(/^(```|---)/g, "");
		//清除组合情况
		line = line.replace(/[*_=~]{3,}(.*?)[*_]{3,}/g, "$1");
		//清除加粗，高亮，删除线
		line = line.replace(/[_*=~]{2}(.*?)[_*=~]{2}/g, "$1");
		//清除斜体，行内代码
		line = line.replace(/[_*`](.*?)[_*`]/g, "$1");
		//清除有序列表
		line = line.replace(/\s*\d.\s/g, "");
		//清除任务列表
		line = line.replace(/\s*-\s\[(.|\s)\]\s/g, "");
		//清除无需列表
		line = line.replace(/\s*-\s/g, "");
		//清除引用
		line = line.replace(/\s*>+\s/g, "");
		//清除缩进
		line = line.replace(/^(\s|\t)+/g, "");
		//清除链接和图片
		line = line.replace(/!?\[([^]]*?)\]\(([^)]*?)\)/g, "$1 $2");
		//清除行内公式
		line = line.replace(/\$([^$]*?)\$/g, "$1");
		//清除公式块
		line = line.replace(/^\$\$/g, "");
		//清除注释
		line = line.replace(/<!--.*?-->/g, "");
		//清除注释块
		line = line.replace(/^(<!--|-->)/g, "");
		//清除ob行内注释
		line = line.replace(/%%(.*?)%%/g, "$1");
		//清除ob块注释
		line = line.replace(/^%%/g, "");
		//清除markdown链接和图片
		line = line.replace(/!?\[([^\]]*?)\]\(([^\)]*?)\)/g, "$1 $2");
		//清除快引用
		line = line.replace(/\[\[(.*?#\^\^?([^\]]*?))\]\]/g, "$1");
		//清除wiki链接和wiki图片
		line = line.replace(/!?\[\[([^\]]*?)\]\]/g, "$1");
		//清除email
		line = line.replace(/<([^>]*?@[^>]*?\.[^>]*?)>/g, "$1");
		//清除图片链接
		line = line.replace(/<a[^>]*?href="([^"]*?)"[^>]*?><img[^>]*?src="([^"]*?)"[^>]*?\/><\/a>/g, "$2-->$1");
		//清除链接
		line = line.replace(/<(https?:\/\/[^>]*?)>/g, "$1");
		//清除html链接标签
		line = line.replace(/<a[^>]*?href="([^"]*?)"[^>]*?>([^<]*?)<\/a>/g, "$2 $1");
		//清除html图片标签
		line = line.replace(/<img[^>]*?src="([^"]*?)"[^>]*?\/?>/g, "image: $1");
		//清除audio标签
		line = line.replace(/<audio[^>]*?src="([^"]*?)"[^>]*?><\/audio>/g, "audio: $1");
		//清除video标签
		line = line.replace(/<video[^>]*?><source\s+src="([^"]*?)"[^>]*?><\/video>/g, "video: $1");
		//清除iframe标签
		line = line.replace(/<iframe[^>]*?src="([^"]*?)"[^>]*?><\/iframe>/g, "iframe: $1");
		//清除html标签
		line = line.replace(/<[^>]*?\/?>/g, "");
		return line + "\n";
	}
}