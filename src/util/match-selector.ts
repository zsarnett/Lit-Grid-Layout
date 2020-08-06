// Credit to react-draggable [https://github.com/STRML/react-draggable]
let matchesSelectorFunc: string | undefined = "";
const matchesSelector = (el: Node, selector: string): boolean => {
  if (!matchesSelectorFunc) {
    matchesSelectorFunc = [
      "matches",
      "webkitMatchesSelector",
      "mozMatchesSelector",
      "msMatchesSelector",
      "oMatchesSelector",
    ].find((method) => isFunction(el[method]));
  }

  if (!matchesSelectorFunc || !isFunction(el[matchesSelectorFunc])) {
    return false;
  }

  return el[matchesSelectorFunc](selector);
};

export const matchesSelectorAndParentsTo = (
  el: Node,
  selector: string,
  baseNode: Node
): boolean => {
  let node: Node | null = el;
  do {
    // For testing in shadow dom, TODO: Remove
    // eslint-disable-next-line no-console
    console.log("Selector: ", selector, "Node: ", node);

    if (matchesSelector(node, selector)) {
      return true;
    }

    if (node === baseNode) {
      return false;
    }

    node = node.parentNode;
  } while (node);

  return false;
};

const isFunction = (func: any): boolean => {
  return (
    typeof func === "function" ||
    Object.prototype.toString.call(func) === "[object Function]"
  );
};
