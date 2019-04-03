
var express  = require('express');
var app      = express();
var socket   = require('socket.io');
var firebase = require("firebase");
var fs       = require("fs");
const rp = require('request-promise');
const cheerio = require('cheerio');

let rawdata = fs.readFileSync('sites.json');  
let sites = JSON.parse(rawdata);

// firebase credentials
var config = {
    apiKey: "AIzaSyA1bTPMboSZtQ1B8iYgh9dMxr2IuKw7xDY",
    authDomain: "kidsearch-se.firebaseapp.com",
    databaseURL: "https://kidsearch-se.firebaseio.com",
    projectId: "kidsearch-se",
    storageBucket: "kidsearch-se.appspot.com",
    messagingSenderId: "473409708648"
  };
var defaultApp = firebase.initializeApp(config);
var defaultDatabase = defaultApp.database();
var firebaseRef = defaultDatabase.ref();

var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();
var yts            =         require("youtube-scrape")
var cookieParser   =         require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

var server = app.listen(3000,function(){
  console.log("Started on PORT 3000");
});
var io = socket(server);

app.get('/',function(req,res){
	var cookies1 = req.cookies;
	if("userData" in cookies1)
	{
		res.redirect("/home");
	}
	else
	{
		res.sendFile(__dirname + "/" +"website/index.html");
	}
});

app.get('/ideas',function(req,res){
  res.sendFile(__dirname + "/" +"website/ideas.html");
});

app.post('/show_ideas',function(req,res){
	var subject = req.body.subject;
	var class_no = req.body.class_no;
	var data = {};

	const result1 = function(){
			console.log("called");
		    for (key in sites) 
			{
				if(key=="education")
				{
					tempurl = sites[key]["url"];
					search_term = String(subject)+sites[key]["replace"]+"class+"+String(class_no)+"+experiments/";
					url = tempurl+search_term;
					rp(url).then(function(html){
						temp = cheerio.load(html);
						links = []
						text  = []
						temp2 = temp(".content-result > .content-result-link")
						for(var i=0;i<temp2.length/5;i++)
						{
							links = links.concat("https://education.com"+temp2[i].attribs.href)
						}
						temp3 = temp(".content-result > .content-result-link > .front-section > .content-title >.title > span")
						for(var i=0;i<temp3.length/5;i++)
						{
							text = text.concat(temp3[i]["children"][0].data)
						}
						console.log(links, text);
						data["education"]=[links, text];
					})
					.catch(function(err)
					{
					    console.log(err);
					});
				}
				else if(key=="science_buddies")
				{
					tempurl = sites[key]["url"];
					search_term = String(subject)+sites[key]["replace"]+"class+"+String(class_no);
					url = tempurl+search_term;
					rp(url).then(function(html){
						temp = cheerio.load(html);
						links = []
						text  = []
						temp2 = temp(".search-result > div > a")
						for(var i=0;i<temp2.length/5;i++)
						{
							links = links.concat("https://www.sciencebuddies.org"+temp2[i].attribs.href)
						}
						for(var i=0;i<temp2.length/5;i++)
						{
							text = text.concat(temp2[i]["children"][0].data)
						}
						console.log(links, text);
						data["science_buddies"]=[links, text];
					})
					.catch(function(err)
					{
					    console.log(err);
					});
				}
				else if(key=="youtube")
				{
					tempurl = sites[key]["url"];
					search_term = String(subject)+" class "+String(class_no);
					url = tempurl+search_term;
					yts(search_term).then((ytdata)=>{
						links = []
						text  = []
						for(var i=0;i<ytdata["results"].length/5;i++)
						{
							links = links.concat(ytdata["results"][i]["link"].slice(32,))
							text  = text.concat(ytdata["results"][i]["title"])
						}
						console.log(links,text);
						data["youtube"]=[links, text];
					});
				}
			}
			io.sockets.on('connection',function(){
				io.sockets.emit('broadcast',data);
			});
		};
	result1();
	setTimeout(function(){
		res.sendFile(__dirname + "/" +"website/show_ideas.html");
	},5000);
});

app.post('/show_topics',function(req,res){
	var subject = req.body.subject;
	var class_no = req.body.class_no;
	var data = {};

	const result1 = function(){
			console.log("called");
		    for (key in sites) 
			{
				if(key=="education")
				{
					tempurl = sites[key]["url"];
					search_term = String(subject)+sites[key]["replace"]+"class+"+String(class_no)+"/";
					url = tempurl+search_term;
					rp(url).then(function(html){
						temp = cheerio.load(html);
						links = []
						text  = []
						temp2 = temp(".content-result > .content-result-link")
						for(var i=0;i<temp2.length/5;i++)
						{
							links = links.concat("https://education.com"+temp2[i].attribs.href)
						}
						temp3 = temp(".content-result > .content-result-link > .front-section > .content-title >.title > span")
						for(var i=0;i<temp3.length/5;i++)
						{
							text = text.concat(temp3[i]["children"][0].data)
						}
						console.log(links, text);
						data["education"]=[links, text];
					})
					.catch(function(err)
					{
					    console.log(err);
					});
				}
				else if(key=="science_buddies")
				{
					tempurl = sites[key]["url"];
					search_term = String(subject)+sites[key]["replace"]+"class+"+String(class_no);
					url = tempurl+search_term;
					rp(url).then(function(html){
						temp = cheerio.load(html);
						links = []
						text  = []
						temp2 = temp(".search-result > div > a")
						for(var i=0;i<temp2.length/5;i++)
						{
							links = links.concat("https://www.sciencebuddies.org"+temp2[i].attribs.href)
						}
						for(var i=0;i<temp2.length/5;i++)
						{
							text = text.concat(temp2[i]["children"][0].data)
						}
						console.log(links, text);
						data["science_buddies"]=[links, text];
					})
					.catch(function(err)
					{
					    console.log(err);
					});
				}
				else if(key=="youtube")
				{
					tempurl = sites[key]["url"];
					search_term = String(subject)+" class "+String(class_no);
					url = tempurl+search_term;
					yts(search_term).then((ytdata)=>{
						links = []
						text  = []
						for(var i=0;i<ytdata["results"].length/5;i++)
						{
							links = links.concat(ytdata["results"][i]["link"].slice(32,))
							text  = text.concat(ytdata["results"][i]["title"])
						}
						console.log(links,text);
						data["youtube"]=[links, text];
					});
				}
			}
			io.sockets.on('connection',function(){
				io.sockets.emit('broadcast',data);
			});
		};
	result1();
	setTimeout(function(){
		res.sendFile(__dirname + "/" +"website/show_topics.html");
	},5000);
});

app.post('/login_get',function(req,res)
{
  var user_name=req.body.userid;
  var password=req.body.password;

  var snapshot;
  firebaseRef.once("value",function(snapshot){
  	tempor = snapshot.val()
  	if(user_name in tempor && tempor[user_name]["password"]==password)
  	{
  		user = {"uname":user_name, "password":password};
  		res.cookie("userData",user);
  		res.redirect("/home");
  	}
  	else
  	{
  		res.redirect("/login_fail");
  	}
  });
});

app.post('/signup_get',function(req,res){
  var user_name=req.body.userid;
  var password=req.body.password;
  var age = req.body.age;
  var conpass = req.body.con_password;
  //console.log(user_name, password,age,conpass);

  if(password!=conpass)
  {
  	res.redirect("/login_fail");
  }
  else
  {
  	firebaseRef.once("value",function(snapshot){
	  	if(user_name in snapshot.val())
	  	{
	  		res.redirect("/login_fail");
	  	}
	  	else
	  	{
	  		firebaseRef.child(user_name+'/').set({"password":password,"age":age});
	  		user = {"uname":user_name, "password":password};
  			res.cookie("userData",user);
	  		res.redirect("/home");
	  	}
	});
  }
});

app.get('/login_fail',function(req,res)
{
	res.sendFile(__dirname+"/"+"website/login_fail.html");
});

app.get('/home',function(req,res)
{
	var cookies1 = req.cookies;
	if(!("userData" in cookies1))
	{
		res.sendFile(__dirname + "/" +"website/index.html");
	}
	else
	{
		res.sendFile(__dirname+"/"+"website/login_success.html");
	}
});

// var express=require('express');
// var app=express();
// app.get('/',function(req,res)
// {
// res.send('Hello World!');
// });
// var server=app.listen(3000,function() {});