Machine Learning using Common Crawl Corpus
=========================================

This project is a proof of concept illustrtraing how to integrate Amazon Elastic MapReduce, MongoDB and Python to
do machine learning on large data sets. In this project, I use the web data from the Common Crawl Corpus, a web archive
with over 200 TB of archived data. Text from a sample of the Corpus are processed with Amazon Elastic MapReduce
into a JSON file for import into MongoDB. The text is further processed into a format suitable for use in predictive
analytics using Mongo and Python. Using a sample from the Mongo database, Python classifiers are used to train a model for
predicting the probability that a site is a .gov site. Any suitable industry target variable could be used, but ground truth
for .gov sites is trivial to acquire. Model-generated coefficients are exported to Mongo and a final Mongo mapReduce process
applies the coefficients to the entire Mongo database creating a prediction for each domain.


-  Documentation on details of flow is in Doc
-  Code is in src
-  Sample data set fro 46 websites is in Data
