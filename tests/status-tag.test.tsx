import {createRef} from "react";
import {Tag} from "antd";
import type {ComponentRef} from "react";
import {render,screen,fireEvent,cleanup} from "@testing-library/react";
import {it,expect,vi,afterEach} from "vitest";
import {StatusTag} from "../src/StatusTag";
afterEach(cleanup);
it("preserves accessible attributes, styles and native ref",()=>{
 const ref=createRef<ComponentRef<typeof Tag>>();
 render(<StatusTag ref={ref} tone="warning" title="unrecognized" aria-label="未知状态" style={{marginInlineEnd:0}} className="consumer">待核验</StatusTag>);
 const tag=screen.getByLabelText("未知状态"); expect(tag.title).toBe("unrecognized");
 expect(Number.parseFloat(tag.style.marginInlineEnd)).toBe(0);expect(tag.classList.contains("consumer")).toBe(true);expect(ref.current).toBe(tag);
});
it("allows consumers to cancel close without losing their status",()=>{
 const close=vi.fn(event=>event.preventDefault());
 render(<StatusTag closable onClose={close}>进行中</StatusTag>);
 fireEvent.click(screen.getByRole("img",{name:"close"})); expect(close).toHaveBeenCalledOnce();
 expect(screen.getByText("进行中").closest('.ant-tag')?.classList.contains('ant-tag-hidden')).toBe(false);
});
