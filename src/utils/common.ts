import { Editor } from "obsidian";

 //设置光标位置
 export function setCursor(editor: Editor, num = 0, row = 0) {
    const curserStart = editor.getCursor("from");
    const curserEnd = editor.getCursor("to");
    editor.setCursor(
        curserStart.line + row || 0,
        curserEnd.ch + num || 0,
    );
}

//获取父节点
export function parents(el: HTMLElement | ParentNode, selector: string) {
    const parents = [];
    while ((el = el?.parentNode|| document) && el !== document) {
        if (!selector || this.matches(el, selector)) parents.push(el);
    }
    return parents;
}

//判断是否是父节点
export function matches(el: HTMLElement | ParentNode, s: string) {
    const matches = document.querySelectorAll(s);
    let i = matches.length;
    while (--i >= 0 && matches.item(i) !== el) {
        //console.log(i)
    }
    return i > -1;
}

