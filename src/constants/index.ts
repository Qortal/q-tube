const useTestIdentifiers = true;

export const QTUBE_VIDEO_BASE = useTestIdentifiers
  ? "MYTEST_vid_"
  : "qtube_vid_";

  export const QTUBE_PLAYLIST_BASE = useTestIdentifiers
  ? "MYTEST_playlist_"
  : "qtube_playlist_";

  export const SUPER_LIKE_BASE = useTestIdentifiers
  ? "MYTEST_superlike_"
  : "qtube_superlike_";

  export const COMMENT_BASE = useTestIdentifiers
  ? "qcomment_v1_MYTEST_"
  : "qcomment_v1_qtube_";

  export const FOR = useTestIdentifiers
  ? "FORTEST5"
  : "FOR0962";

  export const FOR_SUPER_LIKE = useTestIdentifiers
  ? "MYTEST_sl"
  : `qtube_sl`;

  export const minPriceSuperlike = 10

  interface SubCategory {
    id: number;
    name: string;
}

interface CategoryMap {
    [key: number]: SubCategory[];
}


export const categories = [
    {"id": 1, "name": "Movies"},
    {"id": 2, "name": "Series"},
    {"id": 3, "name": "Music"},
    {"id": 4, "name": "Education"},
    {"id": 5, "name": "Lifestyle"},
    {"id": 6, "name": "Gaming"},
    {"id": 7, "name": "Technology"},
    {"id": 8, "name": "Sports"},
    {"id": 9, "name": "News & Politics"},
    {"id": 10, "name": "Cooking & Food"},
    {"id": 11, "name": "Animation"},
    {"id": 12, "name": "Science"},
    {"id": 13, "name": "Health & Wellness"},
    {"id": 14, "name": "DIY & Crafts"},
    {"id": 15, "name": "Kids & Family"},
    {"id": 16, "name": "Comedy"},
    {"id": 17, "name": "Travel & Adventure"},
    {"id": 18, "name": "Art & Design"},
    {"id": 19, "name": "Nature & Environment"},
    {"id": 20, "name": "Business & Finance"},
    {"id": 21, "name": "Personal Development"},
    {"id": 22, "name": "Other"},
    {"id": 23, "name": "History"},
]


export const subCategories: CategoryMap = {
    1: [ // Movies
        {"id": 101, "name": "Action & Adventure"},
        {"id": 102, "name": "Comedy"},
        {"id": 103, "name": "Drama"},
        {"id": 104, "name": "Fantasy & Science Fiction"},
        {"id": 105, "name": "Horror & Thriller"},
        {"id": 106, "name": "Documentaries"},
        {"id": 107, "name": "Animated"},
        {"id": 108, "name": "Family & Kids"},
        {"id": 109, "name": "Romance"},
        {"id": 110, "name": "Mystery & Crime"},
        {"id": 111, "name": "Historical & War"},
        {"id": 112, "name": "Musicals & Music Films"},
        {"id": 113, "name": "Indie Films"},
        {"id": 114, "name": "International Films"},
        {"id": 115, "name": "Biographies & True Stories"},
        {"id": 116, "name": "Other"}
    ],
    2: [ // Series
        {"id": 201, "name": "Dramas"},
        {"id": 202, "name": "Comedies"},
        {"id": 203, "name": "Reality & Competition"},
        {"id": 204, "name": "Documentaries & Docuseries"},
        {"id": 205, "name": "Sci-Fi & Fantasy"},
        {"id": 206, "name": "Crime & Mystery"},
        {"id": 207, "name": "Animated Series"},
        {"id": 208, "name": "Kids & Family"},
        {"id": 209, "name": "Historical & Period Pieces"},
        {"id": 210, "name": "Action & Adventure"},
        {"id": 211, "name": "Horror & Thriller"},
        {"id": 212, "name": "Romance"},
        {"id": 213, "name": "Anthologies"},
        {"id": 214, "name": "International Series"},
        {"id": 215, "name": "Miniseries"},
        {"id": 216, "name": "Other"}
    ]
}
