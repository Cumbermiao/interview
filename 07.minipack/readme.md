## 实现一个js模块打包器

## babylon @babel/parse
> babylon 已经被转移到 @babel/parse 中。

### babylon 使用

#### babylon.parse(code,[options])
> parse 方法中 code 是整个文件代码

### babylon.parseExpression(code,[options])
> parseExpression 中的 code 是单个表达式。

### options
- allowImportExportEverywhere : 默认情况下 import 和 export 声明语句只能出现在程序的最高级， 设置成 true 时声明语句可以出现在任何允许的地方

- allowReturnOutsideFunction : 默认情况下

- sourceType : 表示代码被解析的模式， 可以为 script 或者 module

- sourceFilename : 将输出AST节点与其源文件名关联起来。在从多个输入文件的ast生成代码和源映射时非常有用

- startLine : 默认情况下，解析的第一行代码被视为第1行。您可以提供一个行号作为开头。用于与其他源工具集成

- plugins : avalible plugins 
estree
jsx
flow
doExpressions
objectRestSpread
decorators (Based on an outdated version of the Decorators proposal. Will be removed in a future version of Babylon)
classProperties
exportExtensions
asyncGenerators
functionBind
functionSent
dynamicImport
templateInvalidEscapes