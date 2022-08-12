export const parser = "tsx";

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.JSXOpeningElement).forEach((element) => {
    if (element?.value?.name?.name === "Button") {
      if (element?.value.attributes.some((el) => el.name.name === "variant")) {
        element?.value.attributes.forEach((el, idx) => {
          // For changing variant name
          if (el?.value?.value === "contained") {
            el.value.value = "outlined";
          }

          // For getting variant name from any object
          /**
           *  const ButtonVariants = {
           *      primary = 'primary',
           *      outlined = 'outlined'
           *  }
           */
          else if(el?.value?.value === "outlined") {
            el.value = j.jsxExpressionContainer(
              j.identifier("ButtonVariants.outlined")
            );
          }
        });
      }
    }
  });
  return root.toSource();
}
