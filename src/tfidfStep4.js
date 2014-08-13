/*
 mapper reducer for computing all tfidf values
result:
{ "_id" : stem@domain, "value" : tfidf}
{ "_id" : "aaa@http://511.ky.gov", "value" : 28.533183819584274 }
 */


con = new Mongo();
db = con.getDB("ccc");

var d = db.step3_results.find( ).toArray()  //d is array of objects
var word_idf_map = {};
d.forEach(function ( val ) {
    word_idf_map[ val._id ] = val.value;
});

mapper = function() {
    key_pair = this._id.split("@")
    word = key_pair[0]
    count =  this.value
    idf = word_idf_map[word]
    tfidf =  count * idf // calc tfidf
    emit(this._id, tfidf);
};


reducer = function(word, doc_freq){
     return doc_freq[0];             // reducer will not be called.
};


db.test.mapReduce(
    mapper,
    reducer,
    {
        out : "step4_results",
        sort: { _id: 1},
        scope: {
            word_idf_map: word_idf_map,
        }
    }
 );
 