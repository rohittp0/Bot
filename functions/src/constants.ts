// This is the id of the video you want to use.
// It should be from your channel or a channel you are authorised to manage.
export const VIDEO_ID = 'sOfC0rcrCs8'
// All the options below are optional if you are confused leave them as they are.
// =====================================           
// |       Entity      |   ENTITY_ID   |
// |-------------------|---------------|
// |   View Count      |       1       |
// |   Like Count      |       2       |
// |   Dislike Count   |       3       |
// |   Favorite Count  |       4       |
// |   Comment Count   |       5       |
// =====================================  
// If you want to change the title set CHANGE to true else set it to false.
// The video title will be updated to the format PREFIX <entity> POSTFIX
// The ENTITY_ID determins which entity to use the default value (1) is for view count.
// For all values refer to the table above
export const TITLE = {
    CHANGE: true,
    PREFIX: 'This video has ',
    POSTFIX: ' views',
    ENTITY_ID: 1
};
// If you want to change the description set CHANGE to true else set it to false.
// The video description will be updated to the format PREFIX <entity> POSTFIX
// The ENTITY_ID determins which entity to use the default value (2) is for like count.
// For all values refer to the table above
export const DESCRIPTION = {
    CHANGE: true,
    PREFIX: 'This video is liked by ',
    POSTFIX: ' users',
    ENTITY_ID: 2
};

//-------------------------------------------------------------------
// Don't change any thing below unless you know what you are doing
//-------------------------------------------------------------------

export function getEntity(id: number, statistics: { viewCount: any; likeCount: any; dislikeCount: any; favoriteCount: any; commentCount: any; }) {
    switch (id) {
        case 1:
            return statistics.viewCount;
        case 2:
            return statistics.likeCount
        case 3:
            return statistics.dislikeCount;
        case 4:
            return statistics.favoriteCount;
        case 5:
            return statistics.commentCount;
        default:
            return "Invalid ENTITY_ID"
    }
};

export interface snippet {
    description?: string,
    title?: string,
    tags?: [],
    thumbnails?: {
        default: {
            height: number,
            width: number,
            url: string
        }
    },
    categoryId: number,
    defaultLanguage: string,
}
