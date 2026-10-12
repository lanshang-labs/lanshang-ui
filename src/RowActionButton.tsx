import {forwardRef,type ComponentRef} from "react";
import {Button,type ButtonProps} from "antd";
/** For table actions, including Popconfirm triggers; callbacks and permissions are caller-owned. */
export const RowActionButton=forwardRef<ComponentRef<typeof Button>,Omit<ButtonProps,"type">>(function RowActionButton({className="",...props},ref){
 return <Button {...props} ref={ref} type="text" size={props.size??"small"} className={`bui-row-action ${className}`}/>;
});
