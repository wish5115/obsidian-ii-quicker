//markdown代码
export const markdownCodes = [
	{ key: "H1", name: "标题1", code: "# " },
	{ key: "H2", name: "标题2", code: "## " },
	{ key: "H3", name: "标题3", code: "### " },
	{ key: "H4", name: "标题4", code: "#### " },
	{ key: "H5", name: "标题5", code: "##### " },
	{ key: "H6", name: "标题6", code: "###### " },
	{ key: "Tag", name: "标签", code: "#" },
	{ key: "Bold", name: "加粗", code: "**{}**", cursor: -2 },
	{ key: "Italic", name: "斜体", code: "*{}*", cursor: -1 },
	{ key: "Strikethrough", name: "删除线", code: "~~{}~~", cursor: -2 },
	{ key: "Highlight", name: "高亮", code: "=={}==", cursor: -2 },
	{ key: "Underline", name: "下划线", code: "<u>{}</u>", cursor: -4 },
	{ key: "Horizontal rule", name: "分割线", code: "---\n" },
	{ key: "Date", name: "日期", code: "YYYY-MM-DD ddd" },
	{ key: "Time", name: "时间", code: "YYYY-MM-DD HH:mm:ss" },
	{ key: "Color", name: "颜色", code: "<font color=\"{1}\">{2}</font>", cursor: -7 },
	{key: "Background color", name: "背景色", code: "<span style=\"background:{1}\">{2}</span>", cursor: -7},
	{ key: "Indent", name: "缩进", code: "\t" },
	{ key: "Sup", name: "上标", code: "<sup>{}</sup>", cursor: -6 },
	{ key: "Sub", name: "下标", code: "<sub>{}</sub>", cursor: -6 },
	{ key: "Bullet list", name: "无序列表", code: "- " },
	{ key: "Numbered list", name: "有序列表", code: "1. " },
	{ key: "Task list", name: "任务列表", code: "- [ ] " },
	{ key: "Quote", name: "引用", code: "> " },
	{ key: "Code", name: "行内代码", code: "`{}`", cursor: -1 },
	{ key: "Code block", name: "代码块", code: "```\n{}\n```", cursor: -3 },
	{ key: "Link", name: "链接", code: "[{1}]({2} \"{3}\")", cursor: -4 },
	{ key: "Image", name: "图片", code: "![{1}]({2} \"{3}\")", cursor: -4 },
	{ key: "Table", name: "表格", code: "| | |\n|:-:|:-:|\n| | |" },
	{ key: "Audio", name: "音频", code: "<audio controls=\"controls\" preload=\"none\" src=\"{1}\"></audio>", cursor: -10 },
	{ key: "Video", name: "视频", code: "<video width=\"{1}\" height=\"{2}\" controls><source src=\"{3}\" type=\"video/{4}\"></video>", cursor: -27 },
	{ key: "Iframe", name: "嵌入网页", code: "<iframe width=\"{1}\" height=\"{2}\" src=\"{3}\" scrolling=\"auto\" border=\"0\" frameborder=\"no\" framespacing=\"0\" allowfullscreen=\"true\"></iframe>", cursor: -96 },
	{ key: "Align left", name: "左对齐", code: "<div align=\"left\">{}</div>", cursor: -6 },
	{ key: "Align right", name: "右对齐", code: "<div align=\"right\">{}</div>", cursor: -6 },
	{ key: "Align center", name: "居中对齐", code: "<div align=\"center\">{}</div>", cursor: -6 },
	{ key: "Align justify", name: "两端对齐", code: "<div align=\"justify\">{}</div>", cursor: -6 },
	{ key: "Anchor", name: "锚点", code: "[anchor](# \"\")", cursor: -4 },
	{ key: "Variables", name: "变量", code: "[title][link]\n[link]: content" },
	{ key: "Footnotes", name: "脚注", code: "content[^1]\n[^1]: comment" },
	{ key: "Callout", name: "Callout", code: "> [!NOTE] Title\n> Contents" },
	{ key: "Html comment", name: "Html注释", code: "<!-- {} -->", cursor: -4 },
	{ key: "Ob comment", name: "Ob注释", code: "%% {} %%", cursor: -3 },
	{ key: "Math line", name: "行内公式", code: "${}$", cursor: -1 },
	{ key: "Math block", name: "公式块", code: "$$\n{}\n$$" },
	{ key: "Wiki link", name: "Wiki链接", code: "[[{}]]", cursor: -2 },
	{ key: "Wiki image", name: "Wiki图片", code: "![[{}]]", cursor: -2 },
	{ key: "Block quote", name: "块引用", code: "[[^]]", cursor: -2 },
	{ key: "Block quote global", name: "全局块引用", code: "[[^^]]", cursor: -2 },
];

export const defContextCodes = ["H1","H2","H3","H4","Link","Image","Underline","Date","Time","Color","Background color", "Align center", "Align right", "Sup","Sub", "Html comment", "Ob comment", "Callout", "Footnotes", "Audio","Video","Iframe"];

//常见颜色
//see https://zhuanlan.zhihu.com/p/508870810
export const colors = [
	'#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'
];

// 禅模式预置样式
export const zenModeDefaultStyle = `
/***** Workspace background style (工作区背景样式222) *****/
/* Styles for light theme (工作区背景在亮色主题下的样式) */
.theme-light .workspace-leaf.mod-active.ii-zen-light .view-content:has(.markdown-source-view),
.theme-light .workspace-leaf.mod-active.ii-zen .view-content:has(.markdown-source-view) {
	background-color: rgba(0, 0, 0, 0.6);
}
/* Styles for light theme (工作区背景在暗色主题下的样式) */
.theme-dark .workspace-leaf.mod-active.ii-zen-light .view-content:has(.markdown-source-view),
.theme-dark .workspace-leaf.mod-active.ii-zen .view-content:has(.markdown-source-view) {
	background-color: rgba(0, 0, 0, 0.3);
}

/**************** Editor Style (编辑器样式) *************/
/* Limit editor size, clamp left minimum value, right maximum value */
/* (限制编辑器大小, clamp左侧是最小值, 右侧是最大值) */
.workspace-leaf.mod-active.ii-zen-light .cm-sizer,
.workspace-leaf.mod-active.ii-zen .cm-sizer {
	max-width: clamp(800px, var(--file-line-width), 60%);
}
/* Editor Styles for light theme (编辑器在亮色主题下的样式) */
.theme-light .workspace-leaf.mod-active.ii-zen-light .cm-sizer,
.theme-light .workspace-leaf.mod-active.ii-zen .cm-sizer{
	background-color: var(--background-primary);
	padding: 20px;
	box-shadow: 0px 0px 100px 15px #000;
	border-radius: 8px;
}
/* Editor Styles for dark theme (编辑器在暗色主题下的样式) */
.theme-dark .workspace-leaf.mod-active.ii-zen-light .cm-sizer,
.theme-dark .workspace-leaf.mod-active.ii-zen .cm-sizer{
	background-color: var(--background-primary);
	padding: 20px;
	box-shadow: 0px 0px 100px 15px #000;
	border-radius: 8px;
}
`

// 参与深度禅模式的元素
export const zenSplits = [
	".workspace-split.mod-root .workspace-tabs.mod-active .workspace-leaf.mod-active",
];

// 参与轻禅模式的元素
export const zenLightSplits = [
	".workspace",
	".workspace-ribbon.mod-left",
	".workspace-split.mod-left-split",
	".workspace-split.mod-right-split",
	".status-bar",
	".workspace-split.mod-root",
	".workspace-split.mod-root .workspace-tabs.mod-active",
	".workspace-split.mod-root .workspace-tabs.mod-active .workspace-leaf.mod-active",
];

// 参与微禅模式的元素
export const zenSlightSplits = [
	".workspace",
	".workspace-ribbon.mod-left",
	".workspace-split.mod-left-split",
	".workspace-split.mod-right-split",
	".status-bar",
	".workspace-split.mod-root",
];

export const statusBarDragCode = `
// 获取状态栏元素
let statusBar = document.querySelector('.status-bar');
//记录当前状态栏位置
const statusPosition = statusBar.style.position;

// 初始化鼠标按下时的位置和状态栏起始位置
let isDragging = false;
let initialMouseX, initialMouseY;
let initialBarOffsetX, initialBarOffsetY;
// 获取页面可视区域尺寸
let viewportWidth = this.innerWidth;
let viewportHeight = this.innerHeight;
// 监听窗口大小变化事件
const resizeEvent = function() {
	//console.log('resize');
	viewportWidth = this.innerWidth;
	viewportHeight = this.innerHeight;
};
this.addEventListener('resize', resizeEvent);

// 监听鼠标按下事件
const mousedownEvent = function(event) {
	//console.log('mousedown');
	if(!global.iiStatusEnableDrag) return;
	isDragging = true;
	initialMouseX = event.clientX;
	initialMouseY = event.clientY;

	const barRect = statusBar.getBoundingClientRect();
	initialBarOffsetX = barRect.left - event.clientX;
	initialBarOffsetY = barRect.top - event.clientY;

	// 确保状态栏元素具有相对定位
	if(statusPosition !== 'fixed' || statusPosition !== 'absolute') {
		statusBar.style.position = 'absolute';
	}

	// 阻止文本选中等默认行为
	event.preventDefault();
}
statusBar.addEventListener('mousedown', mousedownEvent);

// 监听整个文档的鼠标移动事件
const mousemoveEvent = function(event) {
	//console.log('mousemove');
	if(!global.iiStatusEnableDrag) return;
	if (isDragging) {
		//const newX = event.clientX + initialBarOffsetX;
		//const newY = event.clientY + initialBarOffsetY;

		const newX = Math.max(Math.min(event.clientX + initialBarOffsetX, viewportWidth - statusBar.offsetWidth), 0);
		const newY = Math.max(Math.min(event.clientY + initialBarOffsetY, viewportHeight - statusBar.offsetHeight), 0);

		statusBar.style.left = \`\${newX}px\`;
		statusBar.style.top = \`\${newY}px\`;
		statusBar.style.right='auto';
		statusBar.style.bottom='auto';
	}
}
document.addEventListener('mousemove', mousemoveEvent);

// 监听鼠标释放事件
const mouseupEvent = function(event) {
	isDragging = false;
}
document.addEventListener('mouseup', mouseupEvent);
// 监听双击复原
const recoveryStatusBar = () => {
	statusBar.style.left = 'auto';
	statusBar.style.top = 'auto';
	statusBar.style.right='0px';
	statusBar.style.bottom='0px';
	statusBar.style.position = statusPosition || 'fixed';
}
global.iiRecoveryStatusBar = recoveryStatusBar;
const dblclickEvent = (event) => {
	//console.log('dblclickEvent');
	recoveryStatusBar();
}
statusBar.addEventListener('dblclick', dblclickEvent);
// 停止事件监听
global.iiRemoveStatusDragEvents = () => {
	//console.log('removeStatusDragEvents');
	statusBar.removeEventListener('mousedown', mousedownEvent);
	document.removeEventListener('mousemove', mousemoveEvent);
	document.removeEventListener('mouseup', mouseupEvent);
	this.removeEventListener('resize', resizeEvent);
	statusBar.removeEventListener('dblclick', dblclickEvent);
}
`;
