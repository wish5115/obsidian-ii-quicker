# 插件介绍

这个插件有 3 个功能：快速插入 Markdown 代码、状态栏显示文档大小和禅模式，这 3个模式可任意开关。轻量级，全部代码 800 多行，核心代码 200 多行，大多是为了易用性和处理界面逻辑。可以快速插入 Markdown 大多数标签和一些不常用标签，比如时间、Audio、Video、Iframe 等。

# 为什么开发

虽然 Markdown 输入已经很方便，但某些时候某些代码快速输入还是需要的。虽然社区已有相关插件，但大多是需要鼠标点击工具栏，即使使用斜杠命令也需要输入很多字符才调出来，而且掺杂了其他一些命令，不方便。而这个插件，只需要输入 `/ii` 即可调出所有命令，使用起来很方便快捷。也可以快速地插入一些时间、Audio、Video、Iframe 等非常用标签。

加入状态栏显示当前文档大小主要没看到社区有相关插件，而且有时候看看字数和占用空间可以预估下二者的关系也挺有意思嘛。

加入禅模式是为了专注写作而不分心，还因为社区的两个相关插件都有点小问题，所以这次就自己研究了。


# 使用

`/ii`，一般用于插入代码，`ctrl+p + ii`，一般用于对选择文字包裹代码。其他快捷方式，比如：如果想选择加粗命令也可以 `/iib` 等。

`/iiz` 或 `ctrl+p iiz` 显示禅模式，你也可以自己设定快捷键，禅模式可以自定义样式。

状态栏显示当前文件大小会在状态栏显示 `xx.xx KB` 或 `xx.xx MB`。

# 预览

#### 快速输入截图

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-plugin@main/assets/screenshots/list1.png)

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-plugin@main/assets/screenshots/list2.png)

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-plugin@main/assets/screenshots/image-modal.webp)

#### 禅模式截图

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-plugin@main/assets/screenshots/zen-light.png)
![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-plugin@main/assets/screenshots/zen-dark.png)

#### 动画展示

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-plugin@main/assets/screenshots/iiplugin.gif)

# 安装

到这里下载 [Release obsidian-ii-plugin-1.0.1](https://github.com/wish5115/obsidian-ii-plugin/releases/tag/1.0.1)

下载后把 obsidian-ii-plugin.zip 解压后，放到插件目录，重启 obsidian，然后别忘了到设置里开启插件即可。

# 配置说明

![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-plugin@main/assets/screenshots/settings1.webp)
![](https://cdn.jsdelivr.net/gh/wish5115/obsidian-ii-plugin@main/assets/screenshots/settings2.webp)

**Quick insert Markdown code：** 开启这个功能，就会加入常见 Markdown 代码的命令，通过 `/ii` 可快速输入，也可以使用命令面板输入。

**Show doc size in status：** 开启这个功能，就会在状态栏显示当前文档占用空间的大小。

**Zen mode：** 开启这个功能，就会加入禅模式的命令，通过 `/iiz` 或命令面板可打开禅模式，或者自定义快捷键打开。

**Show Chinese tips：** 如果开启这个功能，会在命令列表里的右侧显示中文翻译，参见预览里的图片，默认情况下会根据你的语言自动开关。

**Show Color picker modal：** 这个功能是当你设置文字颜色或背景时，弹出颜色选择对话框供你选择，这里选择了大多数人类最易辨别的 20 种常见颜色，参见：[20 种不同的颜色列表](https://zhuanlan.zhihu.com/p/508870810)

**Common color codes：** 这里可以自定义你的常用颜色，注意，每个颜色代码单独占一行，这里选择了大多数人类最易辨别的 20 种常见颜色，参见：[20 种不同的颜色列表](https://zhuanlan.zhihu.com/p/508870810)

**Show image and link modal：** 这个功能是当你插入图片或链接时，弹出对话框供你填写更多内容。

**Show media modal：** 这个功能是当你插入音视频或 Iframe 时，弹出对话框供你填写更多内容。

**Show tips in images and link code：** 这个功能，当你插入空图片或链接代码时，会在代码中用文字提示每部分含义，对新手比较友好。

**Use only standard Markdown code：** 这个功能，当你插入 Markdown 代码时，使用标准 Markdown 格式插入。

**Date format：** 这个是当你插入日期时，使用的格式，采用和官方一致的时间格式化代码，更多格式参见：[String + Format](https://momentjs.com/docs/#/parsing/string-format/)

**Time format：** 这个是当你插入时间时，使用的格式，采用和官方一致的时间格式化代码，更多格式参见：[String + Format](https://momentjs.com/docs/#/parsing/string-format/)

**Zen mode style：** 这里可以自定义你的禅模式样式，包括编辑器样式和背景样式，事实上，你可以输入任何你想要的样式。

# 问题与反馈

您有任何问题都可以到 [obsidian-ii-plugin/issues](https://github.com/wish5115/obsidian-ii-plugin/issues) 去反馈。

# 开发与改进

```
git clone 
cd 
npm run install
npm run dev
```
