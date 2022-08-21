# Codemod examples
This repository contains codemod scripts for use with [JSCodeshift](https://github.com/facebook/jscodeshift).
## How to install and run Codemod
### 1.  Installation
```bash
npm i jscodeshift
```
### 2. Command for transform files

```bash
jscodeshift -t myTransforms[transformer file] filePath [file paths you wish to transform]
```
## How to write transformer file
Writing a custom transformation isn't very easy and one needs to understand how script file internally converts plain string to an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree).

Also checkout the  [AST Explorer](https://astexplorer.net/)  website to get an understanding of ASTs in general.

### Example

So lets say I want to update the import statements throughout the application from something like —

```ts
import Button from '@mui/material/Button'
```

to something like —

```ts
import {Button} from '@abc'
```

To achieve this goal I will remove old import declaration add new import declaration. 
1.  Create a transformer file `importDeclaration.transform.ts` file
```ts
export  default  function  transformer(file, api) {
	const  j = api.jscodeshift;
	const  root = j(file.source);
	
	root
	.find(j.ImportDeclaration)
	.filter((path) => path?.node?.source?.value === "@mui/material/Button")
	.remove();
	
	const  newButtonImport = j.importDeclaration(
		[j.importDefaultSpecifier(j.identifier("{Button}"))],
		j.stringLiteral("@abc")
	);
	
	root.get().node.program.body.unshift(newButtonImport);
	return  root.toSource();
}
```
2.  Run transformer file over your application 
```bash
jscodeshift -t importDeclaration.transform.ts ./src
```

## Checkout more examples
For checking out more examples just follow below commands -
```bash
1. git clone https://github.com/chandan1499/tsx-codemod-example.git
2. cd tsx-codemod-example
3. code .
4. cd codemod-transform-examples
```

## Post Transformation

1.  Life can't be that simple right? Running transformations will generally ruin the formatting of your files. A recommended way to solve that problem is by using [Prettier].
2.  Even after running prettier its possible to have unnecessary new lines added/removed. This can be solved by ignoring white spaces while staging the changes in `git`.

```bash
git diff --ignore-blank-lines | git apply --cached
```

[prettier]: https://prettier.io

## Also checkout For writing your custom transformer
[jscodeshift community Docs](https://www.codeshiftcommunity.com/docs/)
