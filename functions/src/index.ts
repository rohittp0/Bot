import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const VIDEO_ID = "sOfC0rcrCs8"
const API_KEY = "&key=" + functions.config().youtube.api_key
const GET_URL = "https://www.googleapis.com/youtube/v3/videos?part=statistics&id="
const INSERT_URL = "https://www.googleapis.com/youtube/v3/videos?part=snippet"

export const updateViews = functions.https.onRequest((_request, response) => {
    fetch(GET_URL+VIDEO_ID+API_KEY).then(res => res.json())
        .then((json) => json.items[0].statistics.viewCount)
        .then((views) => {
            console.log(views);
            
            let param = { 
                method: 'PUT', 
                body: JSON.stringify({
                    id: VIDEO_ID,
                    snippet: {
                        //description: "This description is in English.",
                        title: "This video has "+views+" views"
                    }
                }),
                headers: { 'Content-Type': 'application/json' }
            };
            return fetch(INSERT_URL + API_KEY, param);
        }).then(res => res.json())
        .then(response.json)
        .catch(response.send)
});
