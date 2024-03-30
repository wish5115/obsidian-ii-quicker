# 介绍

这个插件的主要功能有：快速插入Markdown代码，禅模式，浏览器搜索，状态栏显示当前文档大小，用户自定义命令，JavaScript和CSS代码片段，可拖动状态栏，设置面板增加最小化按钮等。


# 特色

- 快速插入常见Markdown代及一些HTML代码，包括Sup，Sub，Audio，Video，Iframe，左中右对齐，变量，脚注，Callout，锚点，HTML注释等。

- 3种禅模式，包括深度禅模式，轻禅模式，微禅模式，并且你可以自定义他们的样式。

- 可以用浏览器搜索选中的文本。

- 状态栏显示当前文档大小。

- 除了常见和的Markdown代码和常见HTML代码外，你还可以自定义你自己的代码，通过自定义命令输入框，可以把你的代码生成命令。

- 如果你想对笔记某个功能做细微的调整可以用CSS代码片段，当CSS不足时，你还可以通过JavaScript代码片段做进一步调整。

- 状态栏可以任意拖动，如果你的状态栏有时候遮挡重要的内容时，这个很有用。

- 设置面板最小化，这个功能可以让你的设置面板暂时隐藏起来，与关闭不同的是会保持你最小化前的信息状态，比如你输入的状态，滚动条的位置等。

- 颜色命令的颜色面板中常见的色块选自22种人类最易分辨的颜色。可参见文章[20种不同的颜色](https://zhuanlan.zhihu.com/p/508870810)或[A Colour Alphabet and the Limits of Colour Coding](https://www.researchgate.net/publication/237005166_A_Colour_Alphabet_and_the_Limits_of_Colour_Coding)


# 安装

到这里下载 [Release obsidian-ii-quicker-1.1.6](https://github.com/wish5115/obsidian-ii-quicker/releases/tag/1.1.6)

下载后把 obsidian-ii-quicker.zip 解压后，放到插件目录，重启 obsidian，然后别忘了到设置里开启插件即可。


# 使用

`/ii`，一般用于插入代码，`ctrl+p + ii`或右键菜单，一般用于对选择文字包裹代码。其他快捷方式，比如：如果想选择加粗命令也可以 `/iib` 等。

`/iiz` 或 `ctrl+p iiz` 显示禅模式，你也可以自己设定快捷键。

禅模式可以通过命令面板`ctrl+p + iiz`触发，或者你也可以设置自己的快捷键。

浏览器搜索可以通过命令面板和右键菜单，通常使用右键菜单更方便。

时间和日期格式化，采用和官方一致的时间格式化代码，更多格式参见：[String + Format](https://momentjs.com/docs/#/parsing/string-format/)

# 预览

#### 快速输入截图

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-quicker@main/assets/screenshots/list1.png)

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-quicker@main/assets/screenshots/list2.png)

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-quicker@main/assets/screenshots/image-modal.webp)

#### 禅模式截图

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-quicker@main/assets/screenshots/zen-light.png)
![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-quicker@main/assets/screenshots/zen-dark.png)

#### 动画展示

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-quicker@main/assets/screenshots/iiplugin.gif)


# 问题与反馈

您有任何问题都可以到 [obsidian-ii-quicker/issues](https://github.com/wish5115/obsidian-ii-quicker/issues) 去反馈。

# 开发与改进

```
git clone https://github.com/wish5115/obsidian-ii-quicker.git
cd obsidian-ii-quicker
npm install
npm run dev
```
