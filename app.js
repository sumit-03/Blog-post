//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const loDash = require("lodash");
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const homeStartingContent = "Hello World! Felling confused/frustrated/bored, come here and write whatever you want and let the world know what you are feeling.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
// app.use(express.static(__dirname + "/public/"));
// app.use(express.static(__dirname + "/post/"));

const postSchema = {
  postTitle: String,
  postContent: String,
  comments: [{title:String, commentBody:String}]
};

const Post = mongoose.model("Post", postSchema);


// let posts = [];

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    if(!err){
      res.render("home", {startingContent:homeStartingContent, posts : posts});
      // console.log(posts);
    }else{
      console.log("error while fetching post");
    }
  });
  
});


app.get("/about", function(req, res){
  res.render("about", {startingContent:aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {startingContent:contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    postTitle: req.body.postTitle,
    postContent: req.body.postBody,
    comments:[]
  });

  post.save(function() {
    res.redirect("/");
  });
  // mongoose.connection.close();
  // res.redirect("/");
});

app.post("/comment", function(req, res){
  const postId = req.body.postId;
  const comm = {
    "title": req.body.commentTitle,
    "commentBody": req.body.commentBody
  };
  // Users.findOneAndUpdate({name: req.user.name}, {$push: {friends: friend}});
  Post.findOneAndUpdate({postTitle: postId}, {$push: {comments: comm}}, function(err, doc){
    if(err){
      console.log(err);
    }
  });
  res.redirect("/");

});
app.get('/post/:postName', function(req, res){
  const parName = req.params.postName;

  /* code before database
    // cons ole.log(parName);

    // posts.forEach(function(e){
    //   if(loDash.lowerCase(e.postTitle) === loDash.lowerCase(parName)){
    //     // console.log('match found!');
    //     res.render('post', {headingPost : e.postTitle, Content : e.postBody});
    //     return;
    //   }
    // });
  */

  // with database
  Post.find({}, function(err, posts){
    if(!err){
        posts.forEach(function(e){
          if(loDash.lowerCase(e.postTitle) === loDash.lowerCase(parName)){
            res.render('post', {headingPost : e.postTitle, Content : e.postContent, comment:e.comments});
            return;
          }
        });
        
    }else{
      console.log("error while fetching post");
    }
  });

});





app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
