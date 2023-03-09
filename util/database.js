const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;


const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://nishibiswasroy:<passwordmongodb+srv://nishibiswasroy:littlebiswasroy@cluster0.nho40uw.mongodb.net/shop?retryWrites=true&w=majority>@cluster0.ratfyli.mongodb.net/?retryWrites=true&w=majority'
  )
    .then(client => {
      console.log('Connected!');
      _db=client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
    });
};

const getDb=()=>{
  if(_db){
    return _db;
  }
  throw 'No db found'
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;
