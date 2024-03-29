import IIPlugin from "src/main";

export class DocSize {
    plugin: IIPlugin;
	static statusBarItemEl: HTMLElement;

    constructor(plugin: IIPlugin) {
        this.plugin = plugin;
		this.statusBarItemEl();
    }

	statusBarItemEl() {
		if(!DocSize.statusBarItemEl) DocSize.statusBarItemEl = this.plugin.addStatusBarItem();
		return DocSize.statusBarItemEl;
	}

	toggle(show: boolean): void {
		this.statusBarItemEl().toggle(show);
	}

    watchDocChange() {
		this.plugin.registerEvent(this.plugin.app.workspace.on('active-leaf-change', () => {
			if (!this.plugin.settings.showDocSize) {
				return;
			}
			const fileSize = this.plugin.app.workspace.getActiveFile()?.stat.size || 0;
			const kb = fileSize / 1024;
			const mb = kb / 1024;
			if (fileSize < 1024 * 1024) {
				this.statusBarItemEl().setText(`${kb.toFixed(2)} KB`);
			} else {
				this.statusBarItemEl().setText(`${mb.toFixed(2)} MB`);
			}
		}));
    }
}