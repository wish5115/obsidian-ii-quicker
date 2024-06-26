// 简体中文

export default {
  //dialog.ts
  "Please input the image address":"请输入图片地址",
  "Please input the image alter":"请输入图片的alt",
  "Please input the image title":"请输入图片标题",
  "Please input the link address":"请输入链接地址",
  "Please input the link name":"请输入链接名",
  "Please input the link title":"请输入链接title",
  "Please input the audio address":"请输入音频地址",
  "Please input the video address":"请输入视频地址",
  "Please select the type of the video":"请选择视频类型",
  "Please input the url address":"请输入URL地址",
  "Please input the width and height":"请输入宽度和高度",
  "Must": "必填",
  "Width optional": "宽度可选",
  "Height optional": "高度可选",
  "Optional": "可选",

  //ColorPicker.ts
  "More colors": "更多颜色",
  "Choose a color":"选择一个颜色",
  "Use this color":"用这个颜色",

  // setting.ts
  "Show command in context menu":"开启右键菜单",
  "If enabled, the command context menu will be displayed when you right-click.":"开启后，你选择的命令将会在右键菜单中显示。",
  "Show color picker modal":"显示颜色选择器",
  "If enabled, the color picker modal will be displayed when you click the color command.":"开启后，当你触发颜色或背景颜色命令时，将会打开颜色选择面板。",
  "Common color codes":"常用颜色代码",
  "The color code here will be displayed in the color dialog modal, with each color code on a separate line.":"这里的颜色代码将会在颜色选择面板中显示，每个颜色代码单独占一行。",
  "Show image and link modal":"显示图片和链接选项对话框",
  "If enabled, the dialog will be displayed when you click the link or image command.":"开启后，当你触发图片或链接命令时，将会显示更多选项对话框。",
  "Show media modal":"显示媒体选项对话框",
  "If enabled, the dialog will be displayed when you click the audio, video, iframe command.":"开启后，当你触发Audio，Video和Iframe命令时，将会显示更多选项对话框。",
  "Show tips in images and link code":"图片和链接代码占位提示文字",
  "If enabled, tips text will be added when inserting images or link code.":"开启后，生成的图片和链接代码中，将会显示占位提示文字。",
  "Use only standard Markdown code":"仅用标准Markdown格式",
  "If enabled, only code in standard Markdown format will be generated.":"开启后，仅使用标准Markdown格式生成代码。",
  "Date format":"日期格式化",
  "Date formatting codes, Y, M, D, d represent year, month, day, and week respectively.":"插入日期时的代码格式化，YYYY, MM, DD, dddd 分别代表年，月，日和星期。",
  "Time format":"时间格式",
  "Time formatting codes, Y, M, D, H, m, s represent year, month, day, hour, minute, and second respectively.":"插入时间时的代码格式，YYYY, MM, DD, HH, mm, ss分别代表年，月，日，时，分，秒。",
  "Choose which codes enable":"选择开启哪些命令",
  "Only the code you checked is added to the list of commands.":"只有你选择的命令才会添加到命令面板中。",
  "Choose which show in context menu":"选择哪些命令添加到右键菜单",
  "Only the code you checked is added to the list of context menu.":"只有你选择的命令才会添加到右键菜单中。",
  "Custom codes":"用户自定义命令",
  "Format: \nName::Code::menu\n\nExample: \nMy Link::<a href=\"{cursor}\">{selection}</a>::menu":"格式： \nName::Code::menu\n\n例如：\nMy Link::<a href=\"{cursor}\">{selection}</a>::menu",
  "settings.customCodeDesc": "1. 每个命令单独占一行\n2. 格式：Name::Code::menu\n3. ::menu代表同时添加到右键菜单\n4. 变量：{selection}代表选中的文字，{cursor}代表光标位置，默认在插入代码的最后\n5. ::开头的行是注释将会忽略\n6. 换行用\\n代替\n7. 如需转义\":\"用\\:代替",
};
