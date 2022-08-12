/**
 *  Three types of Import statements
 *  => import Button from "@mui/material/Button"
 *  => import {Button} from "@mui/material"
 *  => import {Button, Radio, textfield} from "@mui/material"
 *
 *  Agenda
 *  changing all Button imports path to "@newButtonImportPath"
 */

export const parser = "tsx";

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
    if (path.value.source.value !== "@newButtonImportPath") {
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
        path.value.source.value = "@newButtonImportPath";
      } else if (foundButton) {
        path.value.specifiers = newArr;
        shouldAddNewImportStatement = true;
      }
    }
  });

  if (shouldAddNewImportStatement) {
    const newButtonImport = j.importDeclaration(
      [j.importDefaultSpecifier(j.identifier("{Button}"))],
      j.stringLiteral("@newButtonImportPath")
    );

    root.get().node.program.body.unshift(newButtonImport);
  }

  return root.toSource();
}
