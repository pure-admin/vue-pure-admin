export const openLink = (link: string) => {
  const $a: HTMLElement = document.createElement("a");
  $a.setAttribute("href", link);
  $a.setAttribute("target", "_blank");
  $a.setAttribute("rel", "noreferrer noopener");
  $a.setAttribute("id", "external");
  document.getElementById("external") &&
    document.body.removeChild(document.getElementById("external"));
  document.body.appendChild($a);
  $a.click();
  $a.remove();
};
