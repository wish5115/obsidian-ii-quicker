# 介绍

这个插件的主要功能是快速插入常见Markdown代及HTML代码，包括Sup，Sub，Audio，Video，Iframe，左中右对齐，变量，脚注，Callout，锚点，HTML注释等。


# 特色

- 快速插入常见Markdown代码及一些HTML代码等。

- 支持颜色面板，方便快速选择常见颜色及更多颜色代码。

- 支持图片，链接，多媒体等对话框，方便快速输入更多信息。

- 可随意开关命令及可选择哪些命令在右键菜单中显示。

- 除了常见和的Markdown代码和HTML代码外，你还可以自定义你自己的代码，通过自定义命令输入框，可以把你的代码生成命令。

- 颜色命令的颜色面板中常见的色块选自22种人类最易分辨的颜色。可参见文章[20种不同的颜色](https://zhuanlan.zhihu.com/p/508870810)或[A Colour Alphabet and the Limits of Colour Coding](https://www.researchgate.net/publication/237005166_A_Colour_Alphabet_and_the_Limits_of_Colour_Coding)


# 安装

到这里下载 [Release obsidian-ii-quicker-1.1.6](https://github.com/wish5115/obsidian-ii-quicker/releases/)

下载后把 obsidian-ii-quicker.zip 解压后，放到插件目录，重启 obsidian，然后别忘了到设置里开启插件即可。

亦可在obsidian的插件市场中搜索安装。


# 使用

`/ii`，一般用于插入代码，`ctrl+p + ii`或右键菜单，一般用于对选择文字包裹代码。其他快捷方式，比如：如果想选择加粗命令也可以 `/iib` 等。

时间和日期格式化，采用和官方一致的时间格式化代码，更多格式参见：[String + Format](https://momentjs.com/docs/#/parsing/string-format/)

# 截图

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-quicker@main/assets/screenshots/list1.png)

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-quicker@main/assets/screenshots/list2.png)

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-quicker@main/assets/screenshots/image-modal.webp)

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-quicker@main/assets/screenshots/context-menu.png)


# 问题

您有任何问题都可以到 [obsidian-ii-quicker/issues](https://github.com/wish5115/obsidian-ii-quicker/issues) 去反馈。

# 开发

```
git clone https://github.com/wish5115/obsidian-ii-quicker.git
cd obsidian-ii-quicker
npm install
npm run dev
```
