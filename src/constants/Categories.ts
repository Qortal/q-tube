interface SubCategory {
  id: number;
  name: string;
}

interface CategoryMap {
  [key: number]: SubCategory[];
}

const sortCategory = (a: SubCategory, b: SubCategory) => {
  if (a.name === "Other") return 1;
  else if (b.name === "Other") return -1;
  else return a.name.localeCompare(b.name);
};
export const categories = [
  { id: 1, name: "Movies" },
  { id: 2, name: "Series" },
  { id: 3, name: "Music" },
  { id: 4, name: "Education" },
  { id: 5, name: "Lifestyle" },
  { id: 6, name: "Gaming" },
  { id: 7, name: "Technology" },
  { id: 8, name: "Sports" },
  { id: 9, name: "News & Politics" },
  { id: 10, name: "Cooking & Food" },
  { id: 11, name: "Animation" },
  { id: 12, name: "Science" },
  { id: 13, name: "Health & Wellness" },
  { id: 14, name: "DIY & Crafts" },
  { id: 15, name: "Kids & Family" },
  { id: 16, name: "Comedy" },
  { id: 17, name: "Travel & Adventure" },
  { id: 18, name: "Art & Design" },
  { id: 19, name: "Nature & Environment" },
  { id: 20, name: "Business & Finance" },
  { id: 21, name: "Personal Development" },
  { id: 22, name: "Religion" },
  { id: 23, name: "History" },
  { id: 24, name: "Anime" },
  { id: 25, name: "Cartoons" },
  { id: 26, name: "Qortal" },
  { id: 27, name: "Paranormal" },
  { id: 28, name: "Spirituality" },
  { id: 99, name: "Other" },
].sort(sortCategory);

export const subCategories: CategoryMap = {
  1: [
    // Movies
    { id: 101, name: "Action & Adventure" },
    { id: 102, name: "Comedy" },
    { id: 103, name: "Drama" },
    { id: 104, name: "Fantasy & Science Fiction" },
    { id: 105, name: "Horror & Thriller" },
    { id: 106, name: "Documentaries" },
    { id: 107, name: "Animated" },
    { id: 108, name: "Family & Kids" },
    { id: 109, name: "Romance" },
    { id: 110, name: "Mystery & Crime" },
    { id: 111, name: "Historical & War" },
    { id: 112, name: "Musicals & Music Films" },
    { id: 113, name: "Indie Films" },
    { id: 114, name: "International Films" },
    { id: 115, name: "Biographies & True Stories" },
    { id: 199, name: "Other" },
  ].sort(sortCategory),
  2: [
    // Series
    { id: 201, name: "Dramas" },
    { id: 202, name: "Comedies" },
    { id: 203, name: "Reality & Competition" },
    { id: 204, name: "Documentaries & Docuseries" },
    { id: 205, name: "Sci-Fi & Fantasy" },
    { id: 206, name: "Crime & Mystery" },
    { id: 207, name: "Animated Series" },
    { id: 208, name: "Kids & Family" },
    { id: 209, name: "Historical & Period Pieces" },
    { id: 210, name: "Action & Adventure" },
    { id: 211, name: "Horror & Thriller" },
    { id: 212, name: "Romance" },
    { id: 213, name: "Anthologies" },
    { id: 214, name: "International Series" },
    { id: 215, name: "Miniseries" },
    { id: 299, name: "Other" },
  ].sort(sortCategory),
  4: [
    // Education
    { id: 400, name: "Tutorial" },
    { id: 401, name: "Qortal" },
    { id: 402, name: "Documentary" },
    { id: 499, name: "Other" },
  ].sort(sortCategory),

  24: [
    { id: 2401, name: "Kodomomuke" },
    { id: 2402, name: "Shonen" },
    { id: 2403, name: "Shoujo" },
    { id: 2404, name: "Seinen" },
    { id: 2405, name: "Josei" },
    { id: 2406, name: "Mecha" },
    { id: 2407, name: "Mahou Shoujo" },
    { id: 2408, name: "Isekai" },
    { id: 2409, name: "Yaoi" },
    { id: 2410, name: "Yuri" },
    { id: 2411, name: "Harem" },
    { id: 2412, name: "Ecchi" },
    { id: 2413, name: "Idol" },
    { id: 2499, name: "Other" },
  ].sort(sortCategory),
};
