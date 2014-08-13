#!/usr/bin/env python

"""
mapWET.py
mapper for WET files
input: WET files
output: JSON formatted file with { url: [domain, text]}

if line is not URL or text, skip it
if line contains URL, output {url:text}
if line does not start with WARC, accumulate text

"""

import re
import string
import sys
import urllib

def get_domain(line):
    start = string.find(line,'http://')
    start = start + 7
    end =  string.find(line[start:],'/')
    end = end +start
    domain = 'http://'  + line[start:end]
    url =  'http://' + line[start:]
    return (domain,url)

def format_json(domain, text):
    def build_map():
	words = text.split()
	map = {}
	for w in words:
	    if w in map:
		map[w] += 1
	    else:
		map[w] = 1
	return map
	    
    word_freq_map = build_map()
    for w in word_freq_map.keys():
	if w in moby_words:
	    stem= word_stem_map[w]
	    s = '%s\t %s' % ( stem+ "@" + domain,word_freq_map[w])
	    print s
    return 

# input comes from STDIN (standard input)
READING_HEADER = True
url = None
domain = None
text = ''
#read in the word to stem dictionary
#word_stem_map is used as global
opener = urllib.URLopener()
myurl = "https://s3.amazonaws.com/ucsc-project/ccc/wordStemMap.txt"
myfile = opener.open(myurl)
word_stem_map = {}
for line in myfile:
    line = line.strip()
    w,s = line.split('\t')
    word_stem_map[w]=s
moby_words = set(word_stem_map.keys())

for line in sys.stdin:
    # remove leading and trailing whitespace
    line = filter(lambda x: x in string.printable, line)
    line = line.strip()
    line = re.sub(r'[\n\t]', ' ', line)
    flag = string.find(line,'WARC-Target-URI:')
    if flag != -1:
	if url is not None:
	    format_json(  domain,text)
	domain, url = get_domain(line) #get next
	text = ''
	READING_HEADER = False
	continue
    flag = string.find(line,'Software-Info:')
    if flag != -1:
	READING_HEADER = True
	continue
    flag = string.find(line,'WARC')
    if flag != -1:
	continue
    flag = string.find(line,'Content-')
    if flag != -1:
	continue
    if READING_HEADER == False:
	line = line.lower()
	line = re.sub(r"[^a-z' ]", " ", line)
	text =  text + ' ' + line
format_json( domain,text)