export function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export function map(num, start1, stop1, start2, stop2) {
  return ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

export function lerp(start, stop, amount) {
  return amount * (stop - start) + start;
}

// #region dependencies for random ----------

function isNumber(elem) {
  return !(isNaN(elem) || elem === null);
}

// #endregion ----------

export function random(a, b) {
  if (arguments.length === 1) {
    if (Array.isArray(a)) {
      const index = Math.floor(random(a.length));

      return a[index];
    } else if (typeof a === "object") {
      return random(Object.values(a));
    } else if (isNumber(a)) {
      return Math.random() * a;
    }
  } else if (arguments.length === 0) {
    return Math.random();
  }

  return Math.random() * (b - a) + a;
}
