import { App, Modal } from "obsidian";
import IIPlugin from "src/main";
import { t } from "src/lang/helpers";

/**
 * 	颜色选择器
 */
export class ColorPickerModal extends Modal {
    plugin: IIPlugin;
	callback: CallableFunction;
	color: string;
	constructor(app: App, plugin: IIPlugin, callback: CallableFunction) {
		super(app);
		this.color = "#ffffff"; // 默认颜色
		this.callback = callback;
        this.plugin = plugin;
	}

	triggerCallback() {
		if (this.callback) this.callback(this.color);
		this.close();
	}

	onOpen() {
		const { contentEl } = this;

		//格式化颜色代码
		const colors = this.plugin.settings.commonColors.split("\n").filter((item) => item !== "").map((item) => typeof item === 'string' ? item.trim() : item);

		//创建标题
		contentEl.createEl("h2", { text: t("Choose a color") });

		const div = contentEl.createDiv();
		div.addClass("color-contain");

		//创建常用颜色块
		colors.forEach((color, index) => {
			(() => {
				const colorDiv = div.createDiv();
				colorDiv.setAttribute("title", `${color}`);
				colorDiv.addClass("color-item");
				colorDiv.setCssProps({ "background-color": `${color}` });
				colorDiv.onclick = () => {
					this.color = color;
					this.triggerCallback();
				};
			})();
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
		colorWrap.setCssProps({ "background-color": `${this.color}` });
		const colorInput = colorWrap.createEl("input");
		//colorWrap.setCssProps({ "visibility": "hidden" });
		colorInput.type = "color";
		colorInput.value = this.color;
		colorInput.onchange = (event) => {
			this.color = colorInput.value;
			colorWrap.setCssProps({ "background-color": `${this.color}` });
			colorWrap.setAttribute("title", this.color);
			// 在这里处理颜色变更
			//this.triggerCallback()
		};
		//创建颜色选择按钮
		const moreText = more.createEl("span", { text: "🎨" });
		moreText.setAttribute("title", t("More colors"));
		moreText.addClass("color-more-text");

		//创建颜色选择OK按钮
		const okButton = bottom.createEl("button", { text: "OK" });
		okButton.setAttribute("title", t('Use this color'));
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