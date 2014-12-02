var express = require('express');
var mongoskin = require('mongoskin');

var username = 'ianks' // TODO
var password = 'test' // TODO
var url = 'ds049130.mongolab.com' // TODO
var db = mongoskin.db('mongodb://'+username+':'+password+'@'+url+':49130/yelp', {safe:true})
var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
})

app.get('/q0/:format', function(req, res){
    var question = "What restaurants in Middleton are good for kids?";
    var query = {"city":"Middleton", "attributes" : {"Good for Kids" : true}};
    var projection = {};
    db.collection('business').find(query, projection).toArray(function(e, items){
        if (req.params['format'] == 'json'){
            res.status(200).send(items);
        }else if (req.params['format'] == 'html'){
            var answer = items.map(function(d){
                return d['name'];
            }).join(" and ");
            res.status(200).render('answer', {question: question, answer: answer});
        }else if (req.params['format'] == 'd3'){
            res.status(200).render('business', {data: items});
        }
    });
});


app.get('/q1/:format', function(req, res){
    var question = "What is the average time places are open?"; // TODO
    var query = {'city':'Madison'}; // TODO
    var projection = {'_id':0,'name':1,'hours':1}; // TODO
    var collection = 'business';     // TODO
    db.collection(collection)  
        .find(query, projection)
        .limit(10)  // TODO
        .toArray(function(e, items){
        if (req.params['format'] == 'json'){
            res.status(200).send(items);
        }else if (req.params['format'] == 'html'){
            var answer = "09:03 through direct calculation";   // TODO
            
            res.status(200).render('answer', {question: question, answer: answer});
        }
    });
});

app.get('/q2/:format', function(req, res){
    var question = "What is the most reviewed and highest starred restaurant in Madison, WI?"; // TODO
    var query = { 'city':'Madison','categories':'Restaurants','stars':5}; // TODO
    var projection = {'_id':0,'name':1,'stars':1,'review_count':1};
    var collection = 'business';     // TODO
    db.collection(collection)  
        .find(query, projection)
	.sort({'stars':-1,'review_count':-1})        
	.limit(1)  // TODO
        .toArray(function(e, items){
        if (req.params['format'] == 'json'){
            res.status(200).send(items);
        }else if (req.params['format'] == 'html'){
            var answer = items.map(function(d){
                return d['name'];   // TODO
            }).join(" and ");   // TODO
            res.status(200).render('answer', {question: question, answer: answer});
        }
    });
});


app.get('/d3/:format', function(req, res){
    var question = "Which business is most actively reviewed in all of Phoenix?"; // TODO
    var query = {'city':'Middleton'}; // TODO
    var projection = {};    // TODO
    var collection = 'business';     // TODO
    console.log(req.params);
    db.collection(collection)  
	.find(query, projection)
        .limit(20)  // TODO       
	.toArray(function(e, items){
        if (req.params['format'] == 'json'){
            res.status(200).send(items);
        }else if (req.params['format'] == 'd3'){
            res.status(200).render('business', {data: items});
        }
    });
});

app.listen(3000);
console.log('app is listening at localhost:3000');
