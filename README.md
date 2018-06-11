# Introduction
This is a REST search API that takes in a "keyword" as a query parameter and returns the 
list of products containing this keyword in their description.

# Overview
Requests per second limited using "simple-rate-limiter"
Validation done using "Joi"
Csv file reasing using "fast-csv"

# Usage
http://localhost:3000/item?keyword={keyword}
Example:
http://localhost:3000/item?keyword=backpack

# Authentication
None needed

# Error Codes
4xx
Keyword is mandatory
5xx
Server is not started

# Rate limit
2 requests per second