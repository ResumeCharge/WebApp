const getDateAsYYYYMMDD = (date: Date) => {
  return date.toLocaleDateString("en-gb", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default getDateAsYYYYMMDD;
