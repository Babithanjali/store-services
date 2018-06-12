# Introduction
This is a REST search API that takes in a "keyword" as a query parameter and returns the 
list of products containing this keyword in their description.

# Developer notes
REST API developed using Hapi library<br>
Requests per second limited using "simple-rate-limiter"<br>
Validation done using "Joi"<br>
Csv file downloaded and placed in root directory<br>
Csv file reading using "fast-csv"<br>

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