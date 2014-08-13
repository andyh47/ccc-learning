/*
 *verison info
 *
 * Mon Jul 21 15:43:11 PDT 2014
 *
 *Flow updated to move stemming out of Mongo into EMR
 *
 * *[Note emr = Elastic MapReduce, mmr = Mongo mapreduce]
 *flow modified to reduce to word frequencies in emr. saving space??
 *flow as of now is:
 *
 * makeStemDict.py                           moby_words_file -> {_id:word, value:stem}    ## only run once to create word stem map
 * emr (mapWET.py,reduceWET.py)  WAT-> {_id:stem@domain, value:stem_frequency_in_domain} 
                                                        {_id:word, value:stem}
 *getWordFreq.py                            {id:stem@domain, value:stem_frequency_in_domain}-> {_id:stem, value:col_idx}
 *              									                                                       {_id:object,domain:domain, value:row_idx}
 *              									                                                       {_id:object, n_rows:n, n_cols:m}
 *mmr(tfidfStep2.js)                        {"_id": stem@domain, "value":stem_frequency_in_domain} ->{ "_id" : stem "value" : number_of_docs_in_which_stem_occurs }
 *mmr(tfidfStep3.js)                        {"_id" : stem "value" : number_of_docs_in_which_stem_occurs } -> { "_id" : stem, "value" : idf}
 *mmr(tifidfStep4.js )                      {"_id": stem@domain, "value":stem_frequency_in_domain} -> { "_id" : stem@domain, "value" : tfidf}
 *                                                     { "_id" : stem, "value" : idf}
 *
*
* Tue Jul 15 10:03:02 PDT 2014
* 
* running testTFIDF.py shows that tfidf flow works!  result of flow correlate with results using scikit learn tfidf transform
* time to scale up.
*
*
 *Fri Jul 11 11:05:14 PDT 2014
 *Complete flow to tidf
 *
 *[Note emr = Elastic MapReduce, mmr = Mongo mapreduce]
 *flow modified to reduce to word frequencies in emr. saving space??
 *flow as of now is:
 * emr (mapWET.py,reduceWET.py)  WAT-> {_id:word@domain, value:word_frequency_in_domain} 
 *getWordFreq.py                            {id:word@domain, value:word_frequency_in_domain}-> {_id:word, value:stem} 
 *                                                                                             {_id:stem, value:col_idx}
 *              									       {_id:object,domain:domain, value:row_idx}
 *mmr(tfidfStep1.js)                        {{id:word@domain, value:word_frequency_in_domain}-> { "_id": stem@domain, "value":stem_frequency_in_domain} 
 *                                                     {_id:word, value:stem}
 *mmr(tfidfStep2.js)                        {"_id": stem@domain, "value":stem_frequency_in_domain} ->{ "_id" : stem "value" : number_of_docs_in_which_stem_occurs }
 *mmr(tfidfStep3.js)                        {"_id" : stem "value" : number_of_docs_in_which_stem_occurs } -> { "_id" : stem, "value" : idf}
 *mmr(tifidfStep4.js )                      {"_id": stem@domain, "value":stem_frequency_in_domain} -> { "_id" : stem@domain, "value" : tfidf}
 *                                                     { "_id" : stem, "value" : idf}
 *
 * first working flow with test6 was:                                                    
 *emr (mapWET.py,reduceWET.py)  WAT-> {id:domain value:text}
 *mmr(----.js)                                {_id:domain value:text} -> {id:word, value:overall_frequency}
 *getWordFreq.py                            {_id:word, value:overall_frequency} -> {_id:word, value:stem}
 *                                                                                                          -> {_id:stem, value:idx}
 *mmr(tfidfStep1.js)                        {_id:domain value:text} -> { "_id": stem@domain, "value":stem_frequency_in_domain}
 *                                                     {_id:word, value:stem}
 *mmr(tfidfStep2.js)                        {"_id": stem@domain, "value":stem_frequency_in_domain} ->{ "_id" : stem "value" : number_of_docs_in_which_stem_occurs }
 *mmr(tfidfStep3.js)                        {"_id" : stem "value" : number_of_docs_in_which_stem_occurs } -> { "_id" : stem, "value" : idf}
 *mmr(tifidfStep4.js )                      {"_id": stem@domain, "value":stem_frequency_in_domain} -> { "_id" : stem@domain, "value" : tfidf}
 *                                                     { "_id" : stem, "value" : idf} 
 *
 */
