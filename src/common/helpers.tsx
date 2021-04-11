import { ISlaveWithUserInfo } from "./types/ISlaveWithUserInfo";

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

export const sleep = (ts: number): Promise<void> => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve();
    }, ts);
  });
};

export const decOfNum = (number: number, titles: string[]): string => {
  let decCases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : decCases[Math.min(number % 10, 5)]
  ];
};

export const beautyNumberDot = (n: number): string => {
  return String(n).replace(/\./g, ",");
};

export const beautyNumber = (number: number): string => {
  if (number >= 1000000000)
    return beautyNumberDot(Math.floor(number / 100000000) / 10) + " млрд.";

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

export const sortByKey = (key = "") => {
  return (a: any, b: any) => {
    if (a[key] < b[key]) {
      return -1;
    }

    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  };
};

export const searchFilter = (searchQuery: string) => {
  let query = searchQuery.toLocaleLowerCase().split(" ");
  let firstName = query[0] || "";
  let lastName = query[1] || "";

  return (s: ISlaveWithUserInfo): boolean => {
    if (firstName || lastName) {
      let userFirstName = s.user_info.first_name.toLocaleLowerCase();
      let userLastName = s.user_info.last_name.toLocaleLowerCase();
      if (firstName && !lastName) {
        return (
          userFirstName.startsWith(firstName) ||
          userLastName.startsWith(firstName)
        );
      } else if (firstName && lastName) {
        return (
          (userFirstName.startsWith(firstName) &&
            userLastName.startsWith(lastName)) ||
          (userFirstName.startsWith(lastName) &&
            userLastName.startsWith(firstName))
        );
      } else if (!firstName && lastName) {
        return (
          userFirstName.startsWith(lastName) ||
          userLastName.startsWith(lastName)
        );
      }
    }
    return true;
  };
};

export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
