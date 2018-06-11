/*
This is a REST search API that takes in a "keyword" as a query parameter and returns the 
list of products containing this keyword in their description.
*/

//Declare dependencies needed
const Hapi = require("hapi");
const Joi = require("joi");
const server = new Hapi.Server();
var limit = require("simple-rate-limiter");
var request = limit(require("request")).to(1).per(500); //Since API rate limits requests, limiting to 2 requests per second using simple-rate-limiter
var fs = require("fs");
var csv = require("fast-csv");
var async = require('async');

//Server information
server.connection({"host": "localhost", "port":3000 });

var itemsArray = []; //holds all the itemIds read from the csv file

//Read items from the csv file
fs.createReadStream("items.csv")
					.pipe(csv())
					.on('data', function(data){
						itemsArray.push(data);
					})
					.on('end', function(data){
						prepopulateData();
					});

var itemsMetaData = []; //hold the metaData of all the items in  the csv file

//At every node startup, the items' metaData is loaded into memory to avoid frequent calls to the API
function prepopulateData(){
	
    itemsArray.forEach(function(value){
    		//Request for metadata of each item
			var len = String(value).indexOf(',');
    		var itemId = String(value).substring(0,len);
    		
			request('http://api.walmartlabs.com/v1/items/'+itemId+'?format=json&apiKey=kjybrqfdgp3u4yv2qzcnjndj', 
				{ json: true }, (error, response, body) => {
				if (error) { 
					return console.log(error); 
				}
				itemsMetaData.push(response.body);
			});	
    });
};

//Defining the route and a handler for the REST search API
server.route({
    method: "GET",
    path: "/item",
    config: {
		validate:{
			query:{
				keyword: Joi.string().required() //Validating the input query parameter using Joi
			}
		},
		handler: function(request, response) {
			var paramsStr = request.query;
			var resultObj = [];
			itemsMetaData.forEach(function(value){
				var keyword = JSON.stringify(paramsStr.keyword);
				//check if either the "shortDescription" or "longDescription" contains the keyword.
				var shortDesc = "";
				if(value.hasOwnProperty("shortDescription")){
					shortDesc = value["shortDescription"];
				}
				var longDesc = "";
				if(value.hasOwnProperty("longDescription")){
					longDesc = value["longDescription"];
				}
				// if either of the descriptions contain the keyword, add it to the resultObject
				if(shortDesc != null || longDesc != null){
					keyword = keyword.replace(/^"(.*)"$/, '$1');
					if(shortDesc.toLowerCase().includes(keyword.toLowerCase()) || longDesc.toLowerCase().includes(keyword.toLowerCase())){
						resultObj.push(value);
					}
				}
			});
			return response(resultObj);
      	}
    }   
});

//handle errors if any during server start
server.start(error =>{
	if(error){
		console.error("Error was handled!");
		throw error;
	}
	console.log("Listening at "+server.info.uri);
});

