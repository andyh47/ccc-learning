
/*
mapper reducer for computing all tfidf values
result:
{ "_id" : stem@domain, "value" : tfidf}
{ "_id" : id , { domain, word, tfidf}}
 */


con = new Mongo();
db = con.getDB("ccc");
db.step5_results.drop();

mapper = function() {
    key_pair = this._id.split("@")
    word = key_pair[0]
    domain = key_pair[1]
    tfidf=  this.value
    emit(this._id, {"domain":domain, "word":word, "tfidf":tfidf});
};


reducer = function(key, payload){
     return payload;             // reducer will not be called.
};


db.step4_results.mapReduce(
    mapper,
    reducer,
    {
        out : "step5_results",
        sort: { _id: 1}
    }
 );
 