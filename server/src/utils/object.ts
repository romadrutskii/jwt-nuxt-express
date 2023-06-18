export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  let newObj = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}
