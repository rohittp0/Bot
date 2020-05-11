import * as functions from 'firebase-functions'
import { VIDEO_ID, TITLE, DESCRIPTION, snippet, getEntity } from './constants'
import * as readline from 'readline';
import { google } from 'googleapis';
import * as fs from 'fs';

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/youtube'];
const CRED_DIR = __dirname + '/.credentials/';
const TOKEN_PATH = CRED_DIR + 'youtube-data-v3.json';
const JSON_PATH = CRED_DIR + 'credentials.json'

/**
 * Helper function to read JSON file
 * 
 * @param {String} path The path to JSON file.
 * @returns {Promise<JSON>}
 */
function readJSON(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (error, buffer) => {
            if (error) reject(error);
            else resolve(JSON.parse(buffer.toString()));
        })
    });
}

/**
 * Create an OAuth2 client with the credentials from json, and then return a 
 * promise which resolves to OAuth2 object
 * 
 * @param {String} path The path to client credentials JSON file.
 * @returns {google.auth.OAuth2}
 */
async function login() {
    // Load client secrets from a local file.
    const credentials = await readJSON(JSON_PATH)
    // Authorize a client with the loaded credentials, then call the YouTube API.
    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
    try {
        //Check if we have token saved.
        const token = await readJSON(TOKEN_PATH)
        //Found saved token so use it.
        oauth2Client.credentials = token;
        return oauth2Client;
    } catch (error) {
        //No saved token found so get a new one.
        return getNewToken(oauth2Client);
    }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * return a promise which resolves to OAuth2 object
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @returns {Promise<google.auth.OAuth2>}
 */
function getNewToken(oauth2Client: any): Promise<any> {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve, reject) =>
        rl.question('Enter the code from that page here: ', (code: any) => {
            rl.close();
            oauth2Client.getToken(code, (err: any, token: any) => {
                if (err) reject(err)
                else {
                    oauth2Client.credentials = token;
                    //Store token to disk be used in later program executions.
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (error: any) => {
                        if (error) reject(error);
                        else {
                            console.log('Token stored to ' + TOKEN_PATH);
                            resolve(oauth2Client);
                        }
                    });
                }
            });
        }));
}


/**
 * Gets the statistics of the video with video id VIDEO_ID
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function getDetails(auth: any) {
    const service = google.youtube('v3');

    const response = await service.videos.list({
        auth: auth,
        id: VIDEO_ID,
        part: 'statistics'
    });
    if (response.data.items)
        return response.data.items[0].statistics;
    else throw new Error("could not get view count");
}

/**
 * Gets the statistics of the video with video id VIDEO_ID
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @returns {Promise<any>} serevrResponse
 */
async function setDetails(auth: any, Snippet: any): Promise<any> {
    const service = google.youtube('v3');
    return service.videos.update({
        auth: auth,
        part: 'snippet',
        requestBody: {
            id: VIDEO_ID,
            snippet: Snippet
        }
    });
}

/**
 * Creates a snippet object to be used to update the video.
 *
 * @param {object} statistics The statistics object to get values from.
 * @returns {snippet} serevrResponse
 */
function getSnippet(statistics: any): snippet {
    const Snippet: snippet = {
        categoryId: 27,
        defaultLanguage: 'en'
    }
    if (TITLE.CHANGE)
        Snippet.title = TITLE.PREFIX + getEntity(TITLE.ENTITY_ID, statistics) + TITLE.POSTFIX
    if (DESCRIPTION.CHANGE)
        Snippet.description = DESCRIPTION.PREFIX +
            getEntity(DESCRIPTION.ENTITY_ID, statistics) + DESCRIPTION.POSTFIX
    if (!TITLE.CHANGE && DESCRIPTION.CHANGE)
        throw new Error("Atleast one amoung title and discription must be changed");
    return Snippet
}

export const updateViews = functions.https.onRequest((request: any, response) => {
    let auth: any;
    login().then((aut) => auth = aut)
        .then((_) => getDetails(auth))
        .then(getSnippet)
        .then((Snippet) => setDetails(auth, Snippet))
        .then((res) => response.end("Mission Success"))
        .catch((error: any) => {
            console.error(error);
            response.send(error);
        });
});
