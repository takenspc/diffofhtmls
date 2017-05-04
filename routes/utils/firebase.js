const admin = require('firebase-admin');
const links = require('./links');

//
// Firebase
//
const SERVICE_ACCOUNT = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const DATABASE_URL = process.env.FIREBASE_DATABASE_URL || null;

admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    databaseURL: DATABASE_URL,
    databaseAuthVariableOverride: {
        canRead: true,
        canWrite: false,
    },
});
const FIREBASE_REF = admin.database().ref('/');


//
// Utils
//
/**
 * @private
 * @param {Firebase} firebaseRef
 * @returns {Promise<any>}
 */
function getValue(firebaseRef) {
    return firebaseRef.once('value').then((dataSnapshot) => {
        return dataSnapshot.val();
    });
}

/**
 * @private
 * @param {Firebase} firebaseRef
 * @returns {Promise<any>}
 */
function getLastValue(firebaseRef) {
    const query = firebaseRef.limitToLast(1);
    return query.once('value').then((dataSnapshot) => {
        // check number of children
        const numChildren = dataSnapshot.numChildren();
        if (numChildren !== 1) {
            return Promise.reject(new Error(`Unexpected number of children: ${numChildren}`));
        }

        let val;
        dataSnapshot.forEach((childSnapshot) => {
            val = childSnapshot.val();
        });

        return val;
    });
}


//
// Index
//
/**
 * @param {boolean} willCreateLinks
 * @returns {Promise<Section[]>}
 */
function loadIndexJSON(willCreateLinks) {
    const indexRef = FIREBASE_REF.child('index');
    return getValue(indexRef).then((sections) => {
        if (willCreateLinks) {
            links.createLinkForIndexJSON(sections);
        }
        return sections;
    });
}


//
// Diff
//
/**
 * @param {string} sectionPath
 * @returns {Promise<SectionAndDiff>}
 */
function loadDiff(sectionPath) {
    // TODO skip loadIndexJSON here
    return loadIndexJSON(true).then((sections) => {
        const section = links.findSection(sections, sectionPath);
        if (!section) {
            Promise.reject(new Error(`No such section: ${sectionPath}`));
        }

        const diffRef = FIREBASE_REF.child('diff');
        const sectionRef = diffRef.child(sectionPath);
        return getValue(sectionRef).then((diffs) => {
            return {
                section: section,
                diffs: diffs
            };
        });
    });
}


//
// Fetch
//
/**
 * @returns {Promise<number>}
 */
function loadFetchJSON() {
    const updateRef = FIREBASE_REF.child('update');
    return getLastValue(updateRef).then((value) => {
        return value.datetime;
    });
}


//
// Update
//
/**
 * @returns {Promise<UpdateEntry[]>}
 */
function loadUpdateEntries() {
    const updateRef = FIREBASE_REF.child('update');
    return new Promise((resolve, reject) => {
        const query = updateRef.limitToLast(14);
        query.once('value', (dataSnapshot) => {
            const entries = [];

            // TODO
            dataSnapshot.forEach((childSnapshot) => {
                const val = childSnapshot.val();
                entries.push(val);
            });

            resolve(entries.reverse());
        }, (err) => {
            reject(err);
        });
    });
}

module.exports = {
    loadDiff: loadDiff,
    loadFetchJSON: loadFetchJSON,
    loadIndexJSON: loadIndexJSON,
    loadUpdates: loadUpdateEntries
};
