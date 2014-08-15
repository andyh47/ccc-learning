
/*
mapper reducer for converting to format with all words in one list
result:
{ "_id" : domain, "value" : {"payload":  [{ word:word1, tfidf:tfidf} ... ]}

 */


con = new Mongo();
db = con.getDB("ccc");
db.step6_results.drop();

mapper = function() {
    key_pair = this._id.split("@")
    word = key_pair[0]
    domain = key_pair[1]
    tfidf=  this.value
    emit(domain,  { "payload": [{"word":word, "tfidf":tfidf}]})
};


reducer = function(key, value){
    outValue = []
    value.forEach(function(x) {
        x.payload.forEach( function(y) { outValue.push(y) }
                          )
    })
     return (key, {"payload": outValue});             // reducer returns input (an ararry)
};

db.step4_results.mapReduce(
    mapper,
    reducer,
    {
        out : "step6_results",
        sort: { _id: 1}
    }
 );





mapper = function(d,t) {
    key_pair = d.split("@")
    word = key_pair[0]
    domain = key_pair[1]
    tfidf=  t.value
    console.log(domain, '{ "payload": [tfidf]}' )
};
 