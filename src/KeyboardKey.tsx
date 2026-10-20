import type {HTMLAttributes} from 'react';
/** Visual shortcut hint; callers own keyboard handling and accessible action names. */
export function KeyboardKey({className='',...props}:HTMLAttributes<HTMLElement>){
 return <kbd {...props} className={`ls-keyboard-key ${className}`}/>;
}
