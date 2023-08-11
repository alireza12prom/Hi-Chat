export function randomNumber(len: number) {
  const arr = Array(len);
  for (let i = 0; i < len; i++) {
    let n = Math.floor(Math.random() * 10) || 1;
    if (i == 0 && n == 0) n = 1;
    arr[i] = n;
  }
  return parseInt(arr.join(''));
}
