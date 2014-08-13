#!/usr/bin/env python

from operator import itemgetter
import re
import sys

def format_json(domain, text):
    return '{"_id" :"%s", "value" : %d}' % (current_domain, current_count)

current_domain = None
current_count = 0
domain= None

# input comes from STDIN
for line in sys.stdin:
    # remove leading and trailing whitespace
    line = line.strip()

    # parse the input we got from mapper.py
    domain, count = line.split('\t', 1)
    count = int(count)

    # this IF-switch only works because Hadoop sorts map output
    # by key (here: word) before it is passed to the reducer
    if current_domain == domain:
        current_count  += count
    else:
        if current_domain:
            # write result to STDOUT
            print format_json(current_domain, current_count)
        current_count = count
        current_domain = domain

# do not forget to output the last word if needed!
if current_domain == domain:
    print format_json(current_domain, current_count)