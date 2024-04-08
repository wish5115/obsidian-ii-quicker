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
	//{ key: "Image link", name: "图片链接", code: "[![ImageAlt](Image.png \"Title\")](LinkUrl)", cursor: -1 },
	{ key: "Image link", name: "图片链接", code: "<a href=\"\"><img src=\"\" title=\"\" /></a>", cursor: -17 },
	{ key: "Email", name: "Email", code: "<name@mail.com>", cursor: -1 },
	{ key: "PDF", name: "PDF", code: "![[name.pdf#page=number]]", cursor: -1 },
];

export const defContextCodes = ["H1","H2","H3","H4","Link","Image","Underline","Date","Time","Color","Background color", "Align center", "Align right", "Sup","Sub", "Html comment", "Ob comment", "Callout", "Footnotes", "Audio","Video","Iframe"];

//常见颜色
//see https://zhuanlan.zhihu.com/p/508870810
export const colors = [
	'#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'
];

