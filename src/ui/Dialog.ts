import { App, Modal } from "obsidian";
import { t } from "src/lang/helpers";

/**
 * 	对话框面板
 */
export class DialogModal extends Modal {
	callback: CallableFunction;
	[key: string]: string| any;
	// val1: string;
	// val2: string;
	// val3: string;
	// val4: string;
	// val5: string;
	selectionVal: string;
	type: string;
	constructor(app: App, type: string,  selectionVal:string, callback: CallableFunction) {
		super(app);
		this.val1 = "";
		this.val2 = "";
		this.val3 = "";
		this.val4 = "";
		this.val5 = "";
		this.selectionVal = selectionVal;
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
		this.createSource(contentEl, "val2", t("Please input the image address"));
		this.createWidthAndHeight(contentEl, "val4", "val5");
        this.createAltAndTitle(contentEl, "val1", t("Please input the image alter"), "val3", t("Please input the image title"));
	}

	//创建链接表单
	createLinkForm(contentEl: HTMLElement) {
		this.createSource(contentEl, "val2", t("Please input the link address"));
		this.createAltAndTitle(contentEl, "val1", t("Please input the link name"), "val3", t("Please input the link title"), t("Must"));
	}

	//创建音频表单
	createAudioForm(contentEl: HTMLElement) {
		this.createSource(contentEl, "val1", t("Please input the audio address"));
	}

	//创建视频表单
	createVideoForm(contentEl: HTMLElement) {
		this.createSource(contentEl, "val3", t("Please input the video address"));

		contentEl.createEl("div", { text: t("Please select the type of the video") }).addClass("dlg-label");
		const dropdown = contentEl.createEl("select");
		dropdown.createEl("option", { text: "mp4", value: "mp4" });
		dropdown.createEl("option", { text: "ogg", value: "ogg" });
		dropdown.createEl("option", { text: "webm", value: "webm" });
		this.val4 = "mp4";
		dropdown.onchange = (event) => {
			this.val4 = dropdown.value;
		};

		this.createWidthAndHeight(contentEl, "val1", "val2");
	}

	//创建iframe表单
	createIframeForm(contentEl: HTMLElement) {
		this.createSource(contentEl, "val3", t("Please input the url address"));
		this.createWidthAndHeight(contentEl, "val1", "val2");
	}

	createWidthAndHeight(contentEl: HTMLElement, wval:string, hval:string, title?:string) {
		contentEl.createEl("div", { text: title || t("Please input the width and height") }).addClass("dlg-label");
		const wInput = contentEl.createEl("input");
		wInput.type = "number";
		wInput.placeholder = t("Width optional");
		wInput.setCssProps({ "width": "120px" });
		wInput.onchange = (event) => {
			this[wval] = wInput.value;
		};

        contentEl.createEl("span", { text: " x " });
		const hInput = contentEl.createEl("input");
		hInput.type = "number";
		hInput.placeholder = t("Height optional");
		hInput.setCssProps({ "width": "120px" });
		hInput.onchange = (event) => {
			this[hval] = hInput.value;
		};
	}

	createSource(contentEl: HTMLElement, val:string, title?:string) {
		contentEl.createEl("div", { text: title }).addClass("dlg-label");
		const input = contentEl.createEl("input");
		input.type = "text";
		input.setCssProps({ "width": "100%" });
		input.onchange = (event) => {
			this[val] = input.value;
		};
	}

	createAltAndTitle(contentEl: HTMLElement, alt:string, altLabel:string, title:string, titleLabel:string, placeholder?:string) {
		contentEl.createEl("div", { text: altLabel }).addClass("dlg-label");
		const altInput = contentEl.createEl("input");
		altInput.placeholder=placeholder||t("Optional");
		altInput.value = this.selectionVal || "";
		altInput.type = "text";
		altInput.onchange = (event) => {
			this[alt] = altInput.value;
		};

		contentEl.createEl("div", { text: titleLabel }).addClass("dlg-label");
		const titleInput = contentEl.createEl("input");
		titleInput.placeholder=t("Optional");
		titleInput.type = "text";
		titleInput.onchange = (event) => {
			this[title] = titleInput.value;
		};
	}
}
