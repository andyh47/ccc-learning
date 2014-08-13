/*
 mapper reducer for computing idf (inverse document frequency)
result:
{ "_id" : stem, "value" : idf}
{ "_id" : "aaa", "value" : 7.133295954896068 }
*/


con = new Mongo();
db = con.getDB("ccc");

var N = db.numDocs.findOne({},{_id:0, n_rows:1}) // total number of domains
db.step3_results.drop()

mapper = function() {
    word = this._id
    count =  this.value
    doc_freq =  Math.log( N.n_rows/(1 + count))  // idf calculation
    emit(word, doc_freq);
};

reducer = function(word, doc_freq){
     return doc_freq[0];             // reducer will not be called.
};

db.step2_results.mapReduce(
    mapper,
    reducer,
    {
        out : "step3_results",
        scope: {
            N : N
        }
    }
 );
 