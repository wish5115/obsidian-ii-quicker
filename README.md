# Obsidian II-Plugin

# 中文帮助



# Plugin Introduction

This plugin has 3 functions: fast insertion of Markdown code, status bar shows the size of the document and Zen mode, these 3 modes can be switched on and off. Lightweight, all the code more than 800 lines, the core code more than 200 lines, mostly for ease of use and handling interface logic. You can quickly insert most of the Markdown code and some uncommon code, such as time, Audio, Video, Iframe, etc.

# Why Develop

Although Markdown input is already very convenient, there are times when fast input of certain code is needed. Although there are related plugins in the community, most of them require mouse clicking on the toolbar, and even if you use the slash command, you need to input many characters to call it out, and some other commands are mixed in, which is not convenient. This plugin, on the other hand, only needs to type `/ii` to call out all the commands, which is very convenient and quick to use. You can also quickly insert some time, Audio, Video, Iframe and other very useful code.

The main reason for adding the status bar to display the current document size is that I don't see any related plug-ins in the community, and it's also interesting to see the relationship between the word count and the occupied space so that you can predict the relationship between the two.

Zen mode is added to focus on writing without distraction, but also because the community's two related plug-ins are a little problematic, so I did my own research.

# Use

`/ii`, generally for inserting code, and `ctrl+p + ii`, generally for wrapping code around selected text. Other shortcuts, e.g., `/iib` if you want to select bold commands, etc.

`/iiz` or `ctrl+p iiz` show zen mode, you can also set your own shortcuts, zen mode can be customized style.

Status bar shows current file size will show `xx.xx KB` or `xx.xx MB` in status bar.

# Preview

#### Quick Input Screenshot

#### Zen Mode Screenshots

#### Animation



# Installation

Download obsidian-ii-plugin.zip, unzip it and put it in the plugin directory, restart obsidian.

# Configuration

Quick insert Markdown code: enable this function, it will add the commands of common Markdown code, you can input them quickly by `/ii`, or you can use the command panel to input them.

Show doc size in status: enable this function, it will show the size of the current document in status bar.

Zen mode: If this function is enabled, it will add the command of Zen mode, you can open Zen mode by `/iiz` or command panel, or customize the shortcut to open Zen mode.

Show Chinese tips: if this feature is enabled, it will show Chinese translation in the right side of the command list, see the picture in the preview, by default it will be turned on and off automatically according to your language.

Show Color picker modal: this function is to pop up a color picker dialog for you to choose when you set text color or background, here 20 common colors are chosen which are most recognizable to most human beings, see: [list of 20 different colors](https://zhuanlan.zhihu.com/p/508870810 )

Common color codes: here you can customize your common colors, note that each color code is on a separate line, here you can choose 20 common colors that are most recognizable to most humans, see: [list of 20 different colors](https://zhuanlan.zhihu.com/p/508870810 )

Show image and link modal: This function is to pop up a dialog box for you to fill in more information when you insert an image or link.

Show media modal: this function is to pop up a dialog box for you to fill more contents when you insert audio/video or Iframe.

Show tips in images and link code: this function, when you insert empty images or link code, will use text to suggest the meaning of each part in the code, which is more friendly to newbies.

Use only standard Markdown code: this function, when you insert Markdown code, use standard Markdown format to insert.

Date format: this is when you insert the date, use the format, and the official time formatting code, more formats see: [String + Format](https://momentjs.com/docs/#/parsing/string-format/)

Time format: this is the format used when you insert the time, using the same time formatting code as the official one, see [String + Format](https://momentjs.com/docs/#/parsing/string-format/) for more formats.

Zen mode style: here you can customize your zen mode style, including editor style and background style, in fact, you can input any style you want.


# Issues and feedback

You can go to [obsidian-ii-plugin/issues](https://github.com/wish5115/obsidian-ii-plugin/issues) for feedback if you have any questions.

# Development and Improvement

```
git clone 
cd 
npm run install
npm run dev
```
