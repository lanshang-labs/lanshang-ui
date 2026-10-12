import {act, fireEvent, render, screen} from "@testing-library/react";
import {afterEach, expect, test, vi} from "vitest";
import TaskRows from "../src/beautiful-ui/TaskRows";
import {BeautifulNavigation, BeautifulTabs} from "../src/beautiful-ui/Navigation";
import {cleanup} from "@testing-library/react";
afterEach(()=>{cleanup();vi.useRealTimers();});
test("failed deployment never transitions to success on the demo timeline",()=>{
 vi.useFakeTimers();
 render(<TaskRows rows={[{key:"job",label:"发布失败",amount:"连接检查",status:"failed",details:[{label:"连接超时",meta:""}]}]} labels={{failed:"失败",completed:"已完成"}}/>);
 act(()=>vi.advanceTimersByTime(30000));
 expect(screen.queryByText("已完成")).toBeNull();
 expect(screen.getByText("失败")).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:/发布失败/}));
 expect(screen.getByRole("button",{name:/发布失败/}).getAttribute("aria-expanded")).toBe("true");
});
test("navigation preserves platform route and group callbacks",()=>{
 const click=vi.fn(),open=vi.fn();
 render(<BeautifulNavigation items={[{key:"projects",label:"项目",children:[{key:"/groups",label:"项目组"}]}]} selectedKeys={["/groups"]} openKeys={["projects"]} onClick={click} onOpenChange={open}/>);
 fireEvent.click(screen.getByRole("button",{name:"项目组"}));expect(click).toHaveBeenCalledWith({key:"/groups"});
 fireEvent.click(screen.getByRole("button",{name:"项目"}));expect(open).toHaveBeenCalledWith([]);
});
test("disabled navigation cannot change the current page",()=>{
 const change=vi.fn();render(<BeautifulTabs activeKey="a" onChange={change} items={[{key:"a",label:"部署"},{key:"b",label:"不可用",disabled:true}]}/>);
 fireEvent.click(screen.getByRole("button",{name:"不可用"}));expect(change).not.toHaveBeenCalled();
});

test("disabled sidebar items do not invoke route callbacks",()=>{const click=vi.fn();render(<BeautifulNavigation items={[{key:"x",label:"禁止入口",disabled:true}]} selectedKeys={[]} openKeys={[]} onOpenChange={()=>{}} onClick={click}/>);fireEvent.click(screen.getByRole("button",{name:"禁止入口"}));expect(click).not.toHaveBeenCalled();});
test("collapsed groups expose children through a keyboard-usable popup",async()=>{
 const click=vi.fn();render(<BeautifulNavigation collapsed items={[{key:"projects",label:"项目",children:[{key:"groups",label:"项目组"}]}]} selectedKeys={["groups"]} openKeys={[]} onOpenChange={()=>{}} onClick={click}/>);
 expect(screen.queryByRole("button",{name:"项目组"})).toBeNull();
 fireEvent.click(screen.getByRole("button",{name:"项目"}));
 fireEvent.click(await screen.findByRole("button",{name:"项目组"}));
 expect(click).toHaveBeenCalledWith({key:"groups"});
});
