export const parser = "tsx";

export default function removePropsTransformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // remove color and size props form Button component
  root
  .find(j.JSXElement)
  .filter((path) => path?.value?.openingElement?.name.name === "Button")
  .find(j.JSXAttribute)
  .filter(
    (path) =>
      path.node?.name?.name === "color" ||
      path.node?.name?.name === "size"
  )
  .remove();

  return root.toSource();
}