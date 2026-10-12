import {it,expect,vi,afterEach} from "vitest";
import {render,screen,fireEvent,cleanup} from "@testing-library/react";
import {SearchField} from "../src/SearchField";
afterEach(cleanup);
it("submits the current draft only on search and clears it",()=>{
 const search=vi.fn();render(<SearchField aria-label="Query" onSearch={search}/>);
 const input=screen.getByRole("textbox");fireEvent.change(input,{target:{value:"project"}});expect(search).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole("button",{name:"搜索"}));expect(search).toHaveBeenLastCalledWith("project");
 fireEvent.keyDown(input,{key:"Enter",code:"Enter",charCode:13});expect(search).toHaveBeenCalledTimes(2);
 fireEvent.click(screen.getByRole("button",{name:"close-circle"}));expect(search).toHaveBeenLastCalledWith("");
});
