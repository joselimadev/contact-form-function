import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as uuid from 'uuid';
import * as firebase from 'firebase';
import * as dotenv from 'dotenv';

if(process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = firebase.initializeApp({
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
});

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const { name, email, message } = (req.query || req.body );

    if (name && email && message) {
        app.database().ref('/messages/' + uuid()).set({
            name: name,
            email: email,
            message: message
        })
        .then(res => {
            context.res = {
                status: 200,
                body: res
            };
        })
        .catch(err => {
            context.res = {
                status: 400,
                body: err
            };
        })
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};

export default httpTrigger;
