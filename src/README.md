
### Pipeline Flow

The steps in the flow are explained below.

### Amazon Elastic MapReduce 

Used streaming mapReduce with Python mapper (mapWET2_emr.py) and reducer
(reduceWET2_emr.py) to convert WET files to JSON. Additionally, the map reduce
job passes each word through a filter which checks for english words using a
298k english word dictionary, eliminates common words (stop words) and converts
words to a root form (stem). The map reduce results in this format:
{_id:stem@domain, value:stem_frequency_in_domain}

### Processing to convert the initial JSON file into a file with tfidf values

These steps are:


getWordFreq.py - read from Mongo, create row and col indices. count number of
unique documents. Insert results back to Mongo
<br>{_id:obj, stem:stem , value:col_idx}
{_id:object,domain:domain, value:row_idx}
{_id:object, n_rows:n, n_cols:m}


tfidf_step2.js - Mongo map reduce; find number of docs in which stem occurs <br>
{"_id" : stem "value" : number_of_docs_in_which_stem_occurs }


tfidfStep3.js - compute inverse document frequency <br>
{ "_id" : stem, "value" : idf}


tfidfStep4.js - compute tfidf value from Step3 and initial map reduce results
<br>
{ "_id" : stem@domain, "value" : tfidf}


formatStep5.js - reformat to simplify for summary analytics in Mongo. Also
serves as format for python classification job to come.<br>
{ "_id" : stem@domain, "value" : {
  "domain" : domain,
  "word" : word,
  "tfidf" : tfidf
} }


tfidfStep6.js - mapper reducer for converting to format with all data for a
domain in one document result:<br>
{ "_id" : domain, "value" : {"payload": [{ word:word1, tfidf:tfidf} ... ]}


### Classification Model Training

With tfidf values assigned to all words for all sites, the data is ready for use
in classification. The steps in the classification process are:


tfidfStep7.js - split db into .gov and non .gov sites in preparation for
sampling and classification training in Python. No format change but the data is
split into two collections; one for gov and one for non-gov. Result:<br>
{ "_id" : domain, "value" : {"payload": [{ word:word1, tfidf:tfidf} ... ]}


extract_ccc.ipytnb ipython notebook code that extracts sample data set from
step7_results collections and saves as python .pickle file
for use in classification.  Using previoulsy developed code, run Random Forest
for feature selection and Logistic Regression with L1 Regularization to train
model. This classification code is not provided here, however the resulting
model coefficients are. Result is a set of coefficients for the most predicitve
stems.<br>


saveCoef.py saves the python generated stem:coefficient in the lr_coef
collection.<br>

### Prediction using Mongo

The final step in the flow uses the Mongo engine to apply the model-generated
coeficients to the entire data set to make predictions about all 93499 websites.
The coefficients are saved in the lr_coef collection and then apply_coef6.js is
used to compute the probability that a site is a .gov site. The apply_coef6.js
code uses Mongo mapReduce which is marginally faster, with this data set, than
using javacsript to loop over the elements of the db:


applyCoef_step6.js - applies the lr_coef to the step6_results collection. This
is a map reduce that multiplies the tfidf value for each stem by it's respective
coefficient and sums over all values. A finalize step is used to convert the
summed coefficients to a probability using a logistic transform. step8_final
collection result:<br>
{ _id:domain, value:probability_of_gov_site}
