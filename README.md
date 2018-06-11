# Introduction
This is a REST search API that takes in a "keyword" as a query parameter and returns the 
list of products containing this keyword in their description.

# Overview
Requests per second limited using "simple-rate-limiter"<br>
Validation done using "Joi"<br>
Csv file reasing using "fast-csv"<br>

# Usage
http://localhost:3000/item?keyword={keyword} <br>
Example: <br>
http://localhost:3000/item?keyword=backpack <br>

# Authentication
None needed

# Error Codes
4xx - Keyword is mandatory<br>
5xx - Server is not started<br>

# Rate limit
2 requests per second