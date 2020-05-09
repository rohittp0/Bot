import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const VIDEO_ID = "&id=_ylFqO-QZL0"
const API_KEY = "&key="
const API_URL = "https://www.googleapis.com/youtube/v3/videos?part=statistics"

export const updateViews = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
