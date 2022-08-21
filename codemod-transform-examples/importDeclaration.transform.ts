/**
 *  So lets say I want to update the all three types of import statements throughout the application from something like —
 *
 *  => import Button from "@mui/material/Button"
 *  => import {Button} from "@mui/material"
 *  => import {Button, Radio, textfield} from "@mui/material"
 *
 *  to -
 *  import {Button} from "@abc"
 */

export default function transformer(file, api) {
  const j = api.jscodeshift;
  let shouldAddNewImportStatement = false;
  const root = j(file.source);

  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      if (path.node?.source?.value === "@mui/material/Button") {
        shouldAddNewImportStatement = true;
      }
      return path.node?.source?.value === "@mui/material/Button";
    })
    .remove();

  root.find(j.ImportDeclaration).forEach((path) => {
    if (path.value.source.value !== "@abc") {
      let foundButton = false;
      let newArr = path?.value.specifiers.filter((importClause) => {
        if (importClause?.imported?.name === "Button") {
          foundButton = true;
          if (path?.value.specifiers.length === 1) {
            importClause.imported.name = "Button";
          }
        }
        return importClause?.imported?.name !== "Button";
      });

      if (path?.value.specifiers.length === 1 && foundButton) {
        path.value.source.value = "@abc";
      } else if (foundButton) {
        path.value.specifiers = newArr;
        shouldAddNewImportStatement = true;
      }
    }
  });

  if (shouldAddNewImportStatement) {
    const newButtonImport = j.importDeclaration(
      [j.importDefaultSpecifier(j.identifier("{Button}"))],
      j.stringLiteral("@abc")
    );

    root.get().node.program.body.unshift(newButtonImport);
  }

  return root.toSource();
}
