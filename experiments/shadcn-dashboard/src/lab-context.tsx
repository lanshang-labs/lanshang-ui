import {createContext,useContext} from 'react';

export type Sale={id:string;customer:{name:string;email:string;avatar:string};amount:string;status:string;date:string};
export type LabContextValue={
  workspaceName:string;dark:boolean;setDark:(value:boolean)=>void;navigate:(path:string)=>void;
  transactions:Sale[];createSale:()=>void;selectSale:(sale:Sale)=>void;
  report:(title:string,rows:object[])=>void;search:()=>void;
};
export const LabContext=createContext<LabContextValue|null>(null);
export function useLab(){const value=useContext(LabContext);if(!value)throw new Error('Missing lab context');return value;}
