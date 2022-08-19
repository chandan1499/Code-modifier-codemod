// export const parser = "tsx";

export default function removePropsTransformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const getPropsTree = (element) => {
    const props = ["onClick", "color"];
    const value = [
      `() => {
        console.log("clicked...");
      }`,
      "'secondary'",
    ];

    let newProps: any = [];
    props.forEach((propName, idx) => {
      if (!element?.value.attributes.some((el) => el.name.name === propName)) {
        newProps.push(
          j.jsxAttribute(
            j.jsxIdentifier(propName),
            j.jsxExpressionContainer(j.identifier(value[idx]))
          )
        );
      }
    });

    return newProps;
  };

  root.find(j.JSXOpeningElement).forEach((element) => {
    if (element?.value?.name?.name === "Button") {
      const newComponent = j.jsxElement(
        j.jsxOpeningElement(element?.value.name, [
          ...element?.value.attributes,
          ...getPropsTree(element),
        ]),
        element.parent.node.closingElement,
        element.parent.node.children
      );

      j(element.parent).replaceWith(newComponent);
    }
  });

  return root.toSource();
}
