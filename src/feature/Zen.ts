import { ItemView, Notice } from "obsidian";
import IIPlugin from "src/main";
import { zenSplits, zenLightSplits, zenSlightSplits } from "src/config/config";
import { t } from "src/lang/helpers";

export enum ZenMode {
    Deep = 'deep',
    Light = 'light',
    Slight = 'slight'
}

export class Zen {

    plugin: IIPlugin;
    zenMode = ZenMode.Deep;

    constructor(plugin: IIPlugin) {
        this.plugin = plugin;
    }


    fullscreen(zenMode = ZenMode.Deep) {
        //如果子窗口则退出
        const leaf = this.plugin.app.workspace.getActiveViewOfType(ItemView)?.leaf;
        if(leaf?.getContainer().doc.location.href === 'about:blank') {
            new Notice(t("Zen mode is not supported in sub-windows"));
            return
        }
        this.zenMode = zenMode;
        if(this.zenMode === ZenMode.Deep) {
            this.deepZen()
        } else if(this.zenMode === ZenMode.Light) {
            this.lightZen()
        } else {
            this.slightZen()
        }
    }

    exitFullscreen(zenMode = ZenMode.Deep) {
        if(zenMode === ZenMode.Deep) {
            document.exitFullscreen();
        } else if (zenMode === ZenMode.Light) {
            this.lightZen('exitFullscreen')
        } else {
            this.slightZen('exitFullscreen')
        }
    }

    //微禅模式
    slightZen(act="fullscreen") {
        if(document.fullscreenElement) {
            if(this.plugin.zenSlighting) {
                document.exitFullscreen();
                return
            } else {
                document.exitFullscreen();
            }
        }
        if(this.plugin.zenLighting) {
            if(this.plugin.zenSlighting) {
                this.lightZen('exitFullscreen')
                return
            } else {
                this.lightZen('exitFullscreen')
            }
        }
        const body = document.body;
        if(act === "fullscreen") {
            this.plugin.zenSlighting = true;
            body.addClass("ii-zen-slight");
            zenSlightSplits.forEach((item) => {
                document.querySelector(item)?.addClass("ii-zen-slight");
            });

            // document.addEventListener("keydown", (e) => {
            //     if(e.key === "Escape" && this.plugin.zenSlighting){
            //         this.slightZen('exitFullscreen')
            //     }
            // });
        } else {
            this.plugin.zenSlighting = false;
            body.removeClass("ii-zen-slight");
            zenSlightSplits.forEach((item) => {
                document.querySelector(item)?.removeClass("ii-zen-slight");
            });
        }
    }

    //轻禅模式
    lightZen(act="fullscreen") {
        if(document.fullscreenElement) {
            if(this.plugin.zenLighting) {
                document.exitFullscreen();
                return
            } else {
                document.exitFullscreen();
            }
        }
        const body = document.body;
        if(act === "fullscreen") {
            this.plugin.zenLighting = true;

            body.addClass("ii-zen-light");

            //对当前没激活的tab进行隐藏
            const workspaceTabs = body.querySelectorAll(".workspace-split.mod-root .workspace-tabs");
            if(workspaceTabs.length > 0) {
                workspaceTabs.forEach((item) => {
                    //console.log(item.getAttribute("class"));
                    if(item.getAttribute("class")?.indexOf("mod-active")===-1) {
                        item.addClass("ii-zen-light-un-active");
                    }
                });
            }
            //对完全没有激活tab的垂直split进行隐藏
            const verticals = body.querySelectorAll(".workspace-split.mod-vertical");
            if(verticals.length > 0) {
                verticals.forEach((item) => {
                    const verticalTabs = item?.querySelectorAll(".workspace-split.mod-vertical .workspace-tabs");
                    const verticalUNActiveTabs = item?.querySelectorAll(".workspace-split.mod-vertical .workspace-tabs.ii-zen-light-un-active");
                    if(verticalUNActiveTabs.length === verticalTabs.length) {
                        item?.addClass("ii-zen-light-un-active");
                    }
                });
            }
            //对完全没有激活tab的水平split进行隐藏
            const horizontals = body.querySelectorAll(".workspace-split.mod-horizontal");
            if(horizontals.length > 0) {
                horizontals.forEach((item) => {
                    const horizontalsTabs = item?.querySelectorAll(".workspace-split.mod-horizontal .workspace-tabs");
                    const horizontalsUNActiveTabs = item?.querySelectorAll(".workspace-split.mod-horizontal .workspace-tabs.ii-zen-light-un-active");
                    if(horizontalsTabs.length === horizontalsUNActiveTabs.length) {
                        item?.addClass("ii-zen-light-un-active");
                    }
                });
            }

            zenLightSplits.forEach((item) => {
                document.querySelector(item)?.addClass("ii-zen-light");
            });

            // document.addEventListener("keydown", (e) => {
            //     if(e.key === "Escape" && this.plugin.zenLighting){
            //         this.lightZen('exitFullscreen')
            //     }
            // });

        } else {
            this.plugin.zenLighting = false;
            body.removeClass("ii-zen-light");
            zenLightSplits.forEach((item) => {
                document.querySelector(item)?.removeClass("ii-zen-light");
            });
            const workspaceTabs = body.querySelectorAll(".workspace-split.mod-root .workspace-tabs.ii-zen-light-un-active, .workspace-split.mod-vertical, .workspace-split.mod-horizontal");
            if(workspaceTabs.length > 0) {
                workspaceTabs.forEach((item) => {
                    item.removeClass("ii-zen-light-un-active");
                });
            }
        }
    }

    //深度禅模式
    deepZen() {

        // let containerEl: HTMLElement;
        // if(this.zenMode === ZenMode.Deep) {
        //     //深度禅模式
        //     const leaf = this.plugin.app.workspace.getActiveViewOfType(ItemView)?.leaf;
        //     //@ts-ignore
        //     containerEl = leaf?.containerEl;
        // }else {
        //     //轻度禅模式
        //     //@ts-ignore
        //     containerEl = this.plugin.app.workspace.rootSplit?.containerEl
        // }

        const leaf = this.plugin.app.workspace.getActiveViewOfType(ItemView)?.leaf;
        //@ts-ignore
        const containerEl = leaf?.containerEl;
        containerEl.requestFullscreen();

        // 监控全屏事件
        const fullscreenEvent = () => {
            if (document.fullscreenElement) {
                //全屏时
                //添加样式
                if(this.zenMode === ZenMode.Deep) {
                    //添加定制样式
                    document.body.addClass("ii-zen");
                    zenSplits.forEach((item) => {
                        document.querySelector(item)?.addClass("ii-zen");
                    });
                }
              } else {
                //退出全屏时
                //去除样式
                if(this.zenMode === ZenMode.Deep) {
                    //去除定制样式
                    document.body.removeClass("ii-zen");
                    zenSplits.forEach((item) => {
                        document.querySelector(item)?.removeClass("ii-zen");
                    });

                }
                //退出元素监听
                zenMutationObserver.disconnect();
                containerEl.removeEventListener('fullscreenchange', fullscreenEvent);
                //再复制元素到body上，主要是一些弹窗元素
                if(lastNodes.length > 0) {
                    //复制原来containerEl上的元素到body
                    lastNodes.forEach((node) => {
                        //如果结点不存在了则不处理
                        if(node && containerEl === node?.parentNode) {
                            containerEl.removeChild(node);
                            document.body.appendChild(node);
                        }
                    })

                    //如果存在命令面板，则获取焦点
                    const prompt = document.querySelector(".prompt")?.parentNode;
                    if(prompt) {
                        // 命令面板输入框获取焦点
                        const promptInput = document.querySelector(".prompt-input");
                        //@ts-ignore
                        if(promptInput) promptInput?.focus();
                    }
                }
            }
        }
        this.plugin.registerDomEvent(containerEl, 'fullscreenchange', fullscreenEvent);
        //containerEl.addEventListener("fullscreenchange", fullscreenEvent);

        //记录最后写入的2个元素，因为菜单会有背景元素
        const lastNodes: Array<Node> = [];

        // 把suggestion和命令面板等对话框复制到被全屏的容器中，不然新结点无法在全屏容器中显示
        const zenMutationObserver = new MutationObserver((mutationRecords) => {
            if (!document.fullscreenElement) {
                zenMutationObserver.disconnect();
                return;
            }
            mutationRecords.forEach((mutationRecord) => {
                mutationRecord.addedNodes.forEach((node) => {
                    document.body.removeChild(node);
                    containerEl.appendChild(node);
                    //记录最后写入的2个元素，因为菜单会有背景元素
                    if(lastNodes.length >= 2) lastNodes.shift();
                    lastNodes.push(node);
                });
            });
            // 命令面板输入框获取焦点
            const promptInput = document.querySelector(".prompt-input");
            //@ts-ignore
            if(promptInput) promptInput?.focus();
        });
        zenMutationObserver.observe(document.body, { childList: true });
    }
}