/*
 mapper reducer for computing all document frequencies
over entire corpus
result:
{ "_id" : stem "value" : number_of_docs_in_which_stem_occurs }
{ "_id" : "aaa", "value" : 1 }
*/

con = new Mongo();
db = con.getDB("ccc");

mapper = function() {
    var key_words = this._id.split("@");
    var word = key_words[0];
    emit(word , 1);
};

reducer = function(word, count){
     return Array.sum(count);
};

db.test.mapReduce(
    mapper,
    reducer,
    {
        out : "step2_results",
        sort: { _id: 1}
    }
 );
 

