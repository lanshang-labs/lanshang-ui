/** Show package entrypoints in copyable examples while keeping local imports for the live demos. */
export function publicExampleSource(source:string):string {
 return source
  .replace(/\.\.\/dist\/index\.js/g,'@lanshang-labs/ui')
  .replace(/\.\.\/dist\/dock\.js/g,'@lanshang-labs/ui/dock')
  .replace(/\.\.\/dist\/dock\.css/g,'@lanshang-labs/ui/dock.css')
  .replace(/\.\.\/dist\/charts\.js/g,'@lanshang-labs/ui/charts')
  .replace(/\.\.\/dist\/icons\.js/g,'@lanshang-labs/ui/icons')
  .replace(/\.\.\/dist\/styles\.css/g,'@lanshang-labs/ui/styles.css');
}
