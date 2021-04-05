export const getSubDate = (d: Date): string => {
  let curTime = Date.now();
  let delta = (d.getTime() - curTime) / 1000;
  console.log("Delta", delta);
  let minutes = Math.round(delta / 60);
  console.log(minutes);
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `${hours} ${decOfNum(hours, [
    "час",
    "часа",
    "часов",
  ])} и ${minutes} ${decOfNum(minutes, ["минуту", "минуты", "минут"])}`;
};

export const decOfNum = (number: number, titles: string[]): string => {
  let decCases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : decCases[Math.min(number % 10, 5)]
  ];
};

export const beautyNumber = (number: number): string => {
  let str = "";
  let numberString = String(number).split("");
  numberString.reverse().forEach((n, i) => {
    if ((i + 1) % 3) {
      str += "" + n;
    } else {
      str += n + " ";
    }
  });
  return str.split("").reverse().join("").replace(/^\s/, "");
};

export const toFixedSize = (
  str: string,
  size: number,
  showDots: boolean = false
): string => {
  return str.slice(0, size) + (str.length > size && showDots ? "..." : "");
};
