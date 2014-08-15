
/*
muliply tiidf values by coef if it exists
sum  tfidf values by site and apply logistic function to make yhat

result:
{ "_id" : domain, "value" : yhat}

 */


con = new Mongo();
db = con.getDB("ccc");
db.step8_final.drop();

coef_data = db.lr_coef.find().toArray()[0]
coef = coef_data.value
beta0 = coef['%BETA0%']

mapper = function() {
    domain = this._id 
    payload = this.value['payload']
    payload.forEach ( function (x) { 
    	if ( coef[x.word] != null) {
    	     tfidf=  x.tfidf
             partial_sum = tfidf*coef[x.word]
             emit(domain,  partial_sum)
	}
    })   
};


reducer = function(domain, partial_sums){
     yhat  =  Array.sum(partial_sums)
     return (domain, yhat);             // reducer returns input (an ararry)
};

finalize = function(domain, yhat) {
	betax  = beta0 + yhat  
	yhat = 1/(1 + Math.exp(-betax))
	return ( yhat)
};

db.step6_results.mapReduce(
    mapper,
    reducer,
    {
        out : "step8_final",
        sort: { _id: 1},
        scope: {
            coef:coef,
	    beta0:beta0
        },
        finalize : finalize
    }
 );


