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
  icon.alt = "";

  button.append(icon);

  function updateIconTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");

    icon.src = isDark ? "/images/icons/sun.svg" : "/images/icons/moon.svg";

    icon.alt = isDark ? "Ícono de sol" : "Ícono de luna";

    button.setAttribute(
      "aria-label",
      isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro",
    );
  }

  button.addEventListener("click", () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";

    html.classList.remove("light", "dark");
    html.classList.add(newTheme);

    localStorage.setItem("theme", newTheme);

    updateIconTheme();
  });

  updateIconTheme();
  parent.prepend(button);
}
