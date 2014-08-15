Machine Learning with the Common Crawl Corpus
============================================

Ths project is a proof of concept illustrtraing how to integrate Amazon Elastic MapReduce, MongoDB and Python to do machine learning on large data sets. In this project, I use the web data from the Common Crawl Corpus, a web archive with over 200 TB of archived data. Text from a sample of the Corpus are processed with Amazon Elastic MapReduce into a JSON file for import into MongoDB.  The text is further processed into a format suitable for use in predictive analytics using Mongo and Python. Using a sample from the Mongo database, Python classifiers are used to train a model for predicting the probability that a site is a .gov site.  Any suitable industry target variable could be used, but ground truth for .gov sites is trivial to acquire.  Model-generated coefficients are exported to Mongo and a final Mongo mapReduce process applies the coefficients to the entire Mongo database creating a prediction for each domain.
 


- A detailed descriptton of the project is available in doc.
- Source code for the pipeline flow is in src.
- A small data set for testing is in data.

