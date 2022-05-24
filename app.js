//jshint esversion:6
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
	'mongodb://localhost:27017/alumniDB'
);

const postSchema = {
	title: String,
	content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
	Post.find({}, function (err, posts) {
		if (!err) {
			res.render("home", {
				posties: posts,
				dir: __dirname,
			});
		}
	});
});

app.get("/about", function (req, res) {
	res.render("about", {
		title: "About",
		content:
			"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
	});
});

app.get("/contact", function (req, res) {
	res.render("contact", { para: contactContent });
});

app.get("/compose", function (req, res) {
	res.render("compose");
});

app.get("/posts/:topic", function (req, res) {
	const topic = req.params.topic;
	Post.findOne({ title: topic }, function (err, result) {
		if (!err) {
			if (!result) {
				res.render("home", {
					posties: [
						{
							title: "Oops!",
							content: "The content doesn't exist",
						},
					],
				});
			} else {
				res.render("post", {
					title: result.title,
					content: result.content,
				});
			}
		} else {
			console.log("NOT FINE");
		}
	});
});

app.post("/compose", function (req, res) {
	const post = new Post({
		title: req.body.titleInput,
		content: req.body.postBody,
	});
	post.save(function (err, result) {
		if (!err) {
			console.log("working");
			res.redirect("/");
		} else {
			console.log(err.message);
		}
	});
});

let port = process.env.PORT;
if (port == null || port == "") {
	port = "3000";
}

app.listen(port, function () {
	console.log("Server has started sucessfully");
});
