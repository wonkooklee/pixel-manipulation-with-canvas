type ElementConstructor<T extends HTMLElement> = { new (): T; readonly name: string };

export function getElement<T extends HTMLElement>(id: string, type: ElementConstructor<T>): T {
  const element = document.getElementById(id);

  if (!(element instanceof type)) {
    throw new TypeError(`Expected #${id} to be an instance of ${type.name}`);
  }

  return element;
}
