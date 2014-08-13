Sample Data
===========

This is a very limited amount of data for testing.<br>

- test.wet -- a Common Crawl Corpus WET file with data for ~ 40 websites. This the initial input to the pipeline processing.
- wordStemMap.txt -- an english word to word-stem dictionary.  This is used as filter for the text from the web sites.  Words are converted to stems, stop words are removed and words must be English. This was constructed using Python nltk and an english word list from MobyWords.
- lr_coef.json -- Classifier coeffients. The code for classifying websites is not included here.  Instead the coefficients from a logistic regression classification are provided.  Classification was done with Scikit-learn logistic regression.

