
/*
function for splitting db into .gov and non .gov sites
result:
{ "_id" : domain, "value" : {"payload":  [{ word:word1, tfidf:tfidf} ... ]}

 */


con = new Mongo();
db = con.getDB("ccc");
db.step7_results_gov.drop();
db.step7_results_non_gov.drop();
re = /.*gov$/
db.step6_results.find().forEach(
        function(doc) {
            if (doc._id.match(re)){
                db.step7_results_gov.insert(doc)
            } else {
                db.step7_results_non_gov.insert(doc)
            }
        }
)