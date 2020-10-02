import {Observable} from 'rxjs';
import {DB_CURRENT_VERSION, DB_KEY_ROM_HASH, IDbRomArchiveV1, IDbRomArchiveV2} from './db-schema';
import {IDBPDatabase, openDB} from 'idb';
import {IndexedDBBlockedError, IndexedDBError, IndexedDBOpenError, IndexedDBVersionChangeError} from './api';


function upgradeDatabase(database: IDBPDatabase<IDbRomArchiveV2>,
                         oldVersion: number,
                         newVersion: number | null) {

    if ((newVersion ?? DB_CURRENT_VERSION) !== DB_CURRENT_VERSION) {
        throw new Error(`unexpected Database version: ${oldVersion}`);
    }

    switch (oldVersion) {

        case 0:
        // database did not exist until now,
        // fall through

        case 1: {
            // create V1 schema
            const db1 = (database as unknown) as IDBPDatabase<IDbRomArchiveV1>;
            db1.createObjectStore('rom-archive', {keyPath: DB_KEY_ROM_HASH});
        }
        // fall through

        case 2: {
            // update V1 schema to V2 schema
            const db1 = (database as unknown) as IDBPDatabase<IDbRomArchiveV1>;
            db1.deleteObjectStore('rom-archive');

            const db2 = (database as unknown) as IDBPDatabase<IDbRomArchiveV2>;
            db2.createObjectStore('age-online-rom-info', {keyPath: DB_KEY_ROM_HASH});
            db2.createObjectStore('age-online-rom-data', {keyPath: DB_KEY_ROM_HASH});
            db2.createObjectStore('age-online-ram-data', {keyPath: DB_KEY_ROM_HASH});

            break;
        }

        default:
            throw new Error(`cannot upgrade from unknown Database version: ${oldVersion}`);
    }
}


export function openDatabase$(dbName: string): Observable<IDBPDatabase<IDbRomArchiveV2>> {
    return new Observable<IDBPDatabase<IDbRomArchiveV2>>(subscriber => {

        let db: IDBPDatabase<IDbRomArchiveV2>;

        const openDbPromise = openDB<IDbRomArchiveV2>(dbName, DB_CURRENT_VERSION, {

            // may be called while opening the database
            upgrade: upgradeDatabase,

            // may be called while opening the database
            blocked: () => subscriber.error(new IndexedDBBlockedError()),

            // may be called at some later time
            blocking: () => {
                db.close();
                if (!subscriber.closed) {
                    subscriber.error(new IndexedDBVersionChangeError());
                }
            },

            // may be called at some later time
            terminated: () => {
                if (!subscriber.closed) {
                    subscriber.error(new IndexedDBError());
                }
            },
        });

        openDbPromise.then(
            value => {
                db = value;
                if (!subscriber.closed) {
                    subscriber.next(value);
                    // we don't complete() here as the "blocking" and "terminate"
                    // callbacks (see above) may still happen
                }
            },
            reason => subscriber.error(new IndexedDBOpenError(reason)),
        );

        // close database on unsubscribe
        return () => db?.close();
    });
}
