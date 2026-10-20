import type {ComponentPropsWithoutRef} from 'react';
/** Compact shell header. Navigation, account state and permissions belong to the app. */
export function WorkspaceHeader({className='',...props}:ComponentPropsWithoutRef<'header'>){
 return <header {...props} className={`ls-workspace-header ${className}`}/>;
}
