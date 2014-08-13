#!/Users/andyh_mac/anaconda/bin/python
#!/usr/bin/env python
"""
Created on Wed Jul  9 12:24:41 2014

process word frequencies from mongo into word_stem_map and stem_idx_map (column indices)
{"_id":word@domain, "value":word_frequency_in_domain}-> {"_id":word, "value":stem} 
                                                                                              {"_id":stem, "value":col_idx}

@author: andyh_mac
"""
import csv
import nltk as nl
import pymongo 
import sets
from nltk.corpus import stopwords
from pymongo import MongoClient

     
client = MongoClient()
db = client.ccc
collection= db.test


words = list()
domains = list()
documents = collection.find()
for d in documents:
    w,domain = d['_id'].split('@')
    domains.append(domain)
    words.append(w)
words = sorted(list(set(words)))   
domains = sorted(list(set(domains)))  


stem_idx_map = {}
idx=0
for w in words:
    stem_idx_map[w] = idx
    idx +=1
M=idx

idx=0
domain_idx_map={}
for d in domains:
    domain_idx_map[str(d)] = idx
    idx +=1
N=idx

#output to Mongo
db.numDocs.drop()
db.numDocs.insert({'n_rows':N, 'n_cols':M})
db.stemIdxMap.drop()
db.stemIdxMap.insert(stem_idx_map)
for s in stem_idx_map.keys():
    db.stemIdxMap.insert({'stem':d,'value':stem_idx_map[s]})
db.domainIdxMap.drop()
for d in domain_idx_map.keys():
    db.domainIdxMap.insert({'domain':d,'value':domain_idx_map[d]})
    
    

    
    