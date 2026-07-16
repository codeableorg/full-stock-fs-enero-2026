export function mountThemeToggler(parent) {
  if (!(parent instanceof HTMLElement)) {
    console.error(
      "ThemeToggler Error]: No se encontró un contenedor válido para montar el componente.",
    );
    return;
  }

  const button = document.createElement("button");
  button.className = "button button--ghost button--xl-icon";

  const icon = document.createElement("img");
  icon.src = "/images/icons/moon.svg";
  icon.alt = "";

  button.append(icon);
  parent.prepend(button);
}
