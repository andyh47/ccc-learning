/*
 *
 * analysis scripts run interactively
 *
 *db.step5_results.findOne()
{
        "_id" : "a'@http://aeryssports.com",
        "value" : {
                "domain" : "http://aeryssports.com",
                "word" : "a'",
                "tfidf" : 10.438424262072159
        }
}
> 
 *
 *
 *
 * 
 */


// generate word distribution
docs = db.step5_results.aggregate( [ { $group: { _id: "$value.word", word_frequency: {$sum:1}}},
                                                           { $project: { _id:0, word:"$_id", word_frequency:1}},
                                                           { $sort : { word_frequency: -1}}
                                     ])
db.word_freq.insert(docs)
// generate words per site
docs = db.step5_results.aggregate( [ { $group: { _id: "$value.domain", word_count: {$sum:1}}},
                                                           { $project: { _id:0, domain:"$_id", word_count:1}},
                                                           { $sort : { word_count: -1}}
                                     ])
db.words_per_site.insert(docs)
// best tifidf scores
docs = db.step5_results.aggregate( [  { $project : { _id:0, domain: "$value.domain", word: "$value.word", tfidf:"$value.tfidf"}},
                                                           { $match: { tfidf: { $gte: 1000}}},
                                                           { $sort : { tfidf: -1}}
                                   ])
db.best_tfidf.insert(docs)


// export in bash
/*
mongoexport --db ccc --collection word_freq --dbpath /ccc/data/db   --out  ~/word_freq.json
mongoexport --db ccc --collection words_per_site --dbpath /ccc/data/db   --out  ~/words_per_site.json
mongoexport --db ccc --collection tfidf --dbpath /ccc/data/db   --out  ~/tfidf.json

*/