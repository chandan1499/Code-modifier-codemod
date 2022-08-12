export const parser = "tsx";

export default function removePropsTransformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.JSXOpeningElement).forEach((element) => {
    if (element?.value?.name?.name === "Button") {
      if (!element?.value.attributes.some((el) => el.name.name === "onClick")) {
        const newComponent = j.jsxElement(
          j.jsxOpeningElement(element?.value.name, [
            ...element?.value.attributes,
            j.jsxAttribute(
              j.jsxIdentifier("onClick"),
              j.jsxExpressionContainer(
                j.identifier("() => {console.log('clicked...')}")
              )
            ),
          ]),
          element.parent.node.closingElement,
          element.parent.node.children
        );

        j(element.parent).replaceWith(newComponent);
      }
    }
  });

  return root.toSource();
}
