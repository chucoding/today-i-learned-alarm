export const DBConfig = {
    name: 'MyDB',
    version: 1,
    objectStoresMeta: [
      {
        store: 'data',
        storeConfig: { keyPath: 'date', autoIncrement: false },
        storeSchema: [
          { name: 'date', keypath: 'date', options: { unique: false }},
          { name: 'data', keypath: 'data', options: { unique: false }}
        ]
      }
    ]
};