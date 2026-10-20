import {createRef} from "react";
import {ConfigProvider,Form} from "antd";
import type {InputRef} from "antd";
import {it,expect,vi,afterEach} from "vitest";
import {render,screen,fireEvent,cleanup} from "@testing-library/react";
import {SearchField} from "../src/SearchField";
import {controlSizes} from '../src/tokens';
afterEach(cleanup);
it("submits the current draft only on search and clears it",()=>{
 const search=vi.fn();render(<SearchField aria-label="Query" onSearch={search}/>);
 const input=screen.getByRole("textbox");fireEvent.change(input,{target:{value:"project"}});expect(search).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole("button",{name:"搜索"}));expect(search).toHaveBeenLastCalledWith("project");
 fireEvent.keyDown(input,{key:"Enter",code:"Enter",charCode:13});expect(search).toHaveBeenCalledTimes(2);
 fireEvent.click(screen.getByRole("button",{name:"清空搜索"}));expect(search).toHaveBeenLastCalledWith("");
});
it('scales the field and search action together and replays only on click',()=>{
 const search=vi.fn();
 const {container,rerender}=render(<ConfigProvider componentSize="small"><SearchField aria-label="查询" onSearch={search}/></ConfigProvider>);
 expect(container.querySelector('.bui-search-field.ant-input-affix-wrapper-sm .ant-btn-sm')).toBeTruthy();
 expect((container.querySelector('.ls-motion-icon') as HTMLElement).style.width).toBe(`${controlSizes.small.icon}px`);
 rerender(<ConfigProvider componentSize="small"><SearchField size="large" aria-label="查询" onSearch={search}/></ConfigProvider>);
 expect(container.querySelector('.bui-search-field.ant-input-affix-wrapper-lg .ant-btn-lg')).toBeTruthy();
 expect((container.querySelector('.ls-motion-icon') as HTMLElement).style.width).toBe(`${controlSizes.large.icon}px`);
 fireEvent.click(screen.getByRole('button',{name:'搜索'}));
 expect(container.querySelector('.ls-motion-icon.is-playing')).toBeTruthy();
 expect(search).toHaveBeenCalledWith('');
});

it("exposes focus and selection through the public input ref",()=>{
 const ref=createRef<InputRef>(); render(<SearchField ref={ref} defaultValue="sample"/>);
 ref.current?.focus(); expect(document.activeElement).toBe(screen.getByRole("textbox"));
 ref.current?.select(); expect(ref.current?.input?.selectionEnd).toBe(6);
});
it("does not submit composing or cancelled Enter events",()=>{
 const search=vi.fn(); const {rerender}=render(<SearchField onSearch={search}/>);
 fireEvent.keyDown(screen.getByRole("textbox"),{key:"Enter",isComposing:true});
 expect(search).not.toHaveBeenCalled();
 rerender(<SearchField onSearch={search} onPressEnter={event=>event.preventDefault()}/>);
 fireEvent.keyDown(screen.getByRole("textbox"),{key:"Enter"}); expect(search).not.toHaveBeenCalled();
});
it("binds string values to an AntD Form without event adapters",()=>{
 let form:ReturnType<typeof Form.useForm>[0];
 function Demo(){[form]=Form.useForm();return <Form form={form} initialValues={{query:"initial"}}><Form.Item name="query"><SearchField/></Form.Item></Form>}
 render(<Demo/>);fireEvent.change(screen.getByRole("textbox"),{target:{value:"changed"}});
 expect(form!.getFieldValue("query")).toBe("changed");
});
