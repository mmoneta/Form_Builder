import { Instance } from 'JsStore';
declare const JsStore: any;

export class CommonService {
  _connection: Instance;

  constructor() {
    this._connection = new JsStore.Instance();
    const databaseName = 'FormBuilder';

    this._connection.isDbExist(databaseName).then(isExist => {
      if (isExist) {
        this._connection.openDb(databaseName);
      } else {
        const database = this.getDatabase(databaseName);
        this._connection.createDb(database);
      }
    }).catch(err => {
      // this will be fired when indexedDB is not supported.
      console.log(err.Message);
    });
  }

  getDatabase(DatabaseName: string) {
    const TblQuestion = {
        name: 'questions',
        columns: [
          {
            name: 'Id',
            primaryKey: true,
            autoIncrement: true
          },
          {
            name: 'main_index',
            notNull: true,
            dataType: JsStore.DATA_TYPE.Number
          },
          {
            name: 'question',
            notNull: true,
            dataType: JsStore.DATA_TYPE.String
          },
          {
            name: 'answer'
          },
          {
            name: 'level',
            notNull: true,
            dataType: JsStore.DATA_TYPE.Number
          },
          {
            name: 'parameter',
            dataType: JsStore.DATA_TYPE.String
          }
        ]
    };

    const db = {
      name: DatabaseName,
      tables: [TblQuestion]
    };

    return db;
  }
}
