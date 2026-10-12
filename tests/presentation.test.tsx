import {createRef} from "react";
import {render,screen,fireEvent,cleanup} from "@testing-library/react";
import {afterEach,expect,it,vi} from "vitest";
import {PageHeader} from "../src/PageHeader";
import {ContentState} from "../src/ContentState";
import {MetadataList} from "../src/MetadataList";
afterEach(cleanup);
it("exposes the chosen heading level and preserves zero metadata",()=>{
 const ref=createRef<HTMLElement>();render(<PageHeader ref={ref} title="项目" headingLevel={1} headingId="project-title" aria-labelledby="project-title" meta={0}/>);
 expect(screen.getByRole("heading",{level:1}).id).toBe("project-title");
 expect(screen.getByText("0")).toBeTruthy();expect(ref.current?.getAttribute("aria-labelledby")).toBe("project-title");
});
it("allows rich descriptions without nesting blocks in paragraphs",()=>{
 render(<PageHeader title="项目" description={<ul><li>说明</li></ul>}/>);
 expect(screen.getByRole("list").closest("p")).toBeNull();
});
it("keeps failure and retry caller controlled and forwards accessible attributes",()=>{
 const retry=vi.fn(),ref=createRef<HTMLDivElement>();const {rerender}=render(<ContentState ref={ref} title="加载失败" role="alert" aria-label="文件读取" description={0} action={<button onClick={retry}>重试</button>}/>);
 expect(screen.getByRole("alert").getAttribute("aria-live")).toBe("assertive");
 expect(screen.getByText("0")).toBeTruthy();fireEvent.click(screen.getByRole("button"));expect(retry).toHaveBeenCalledOnce();
 expect(screen.getByText("加载失败")).toBeTruthy();expect(ref.current?.getAttribute("aria-label")).toBe("文件读取");
 rerender(<ContentState loading title="加载中"/>);expect(screen.getByRole("status").getAttribute("aria-busy")).toBe("true");
});
it("preserves metadata values, links and list attributes",()=>{
 const ref=createRef<HTMLDListElement>();render(<MetadataList ref={ref} aria-label="项目信息" className="custom" items={[{key:"count",label:"数量",value:0},{key:"link",label:"项目",value:<a href="/project">查看</a>}]}/>);
 expect(ref.current?.tagName).toBe("DL");expect(ref.current?.classList.contains("custom")).toBe(true);
 expect(screen.getByText("0").tagName).toBe("DD");expect(screen.getByRole("link").getAttribute("href")).toBe("/project");
});
