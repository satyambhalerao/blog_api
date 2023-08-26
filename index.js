import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 4000;

mongoose.connect("mongodb+srv://satyambhalerao24:muOZSSYsXxbHebiK@cluster0.wxtvpz6.mongodb.net/blogDB").then(
  ()=>console.log("Connected to Database"),
  (err)=>console.log("Failed to connect "+err.message)
);

const blogSchema = {
  title:String,
  content:String,
  author:String,
  date:Date,
};

const blog = mongoose.model("blog",blogSchema)

const blogs = await blog.find()
if(blogs.length == 0)
{
  const defaultpost1 = new blog({
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  })
  const defaultpost2 =  new blog({   
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  })
  const defaultpost3 =  new blog({
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  })
  
  await blog.insertMany([defaultpost1,defaultpost2,defaultpost3])
  console.log(await blog.find())
}
else
{
  console.log(await blog.find())
}





// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Write your code here//

//CHALLENGE 1: GET All posts
app.get('/posts',async(req, res)=>{
  console.log("sending")
  const updatedblogs = await blog.find()
  res.json(updatedblogs)
  
})

//CHALLENGE 2: GET a specific post by id
app.get('/posts/:id',async(req, res)=>{
  console.log("by id")
  const post = await blog.findById(req.params.id);
  if(!post)
  {
    return res.status(404).json({message:"No post with id:"+id+" found"})
  }
  else
  {
    res.json(post)
  }
})

//CHALLENGE 3: POST a new post
app.post('/posts',async(req, res)=>{
  const newpost=new blog({
    title:req.body.title,
    content:req.body.content,
    author:req.body.author,
    date:new Date()
  })
  newpost.save()
  const newblog = await blog.find()
  res.status(201).json(newblog)
})

//CHALLENGE 4: PATCH a post when you just want to update one parameter
app.patch('/posts/:id',async(req, res)=>{
  console.log("in patch")
  const id = req.params.id
  const post = await blog.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.body.title) await blog.findByIdAndUpdate(id,{title:req.body.title})
  if (req.body.content) await blog.findByIdAndUpdate(id,{content:req.body.content})
  if (req.body.author) await blog.findByIdAndUpdate(id,{author:req.body.author})
  console.log(await blog.findById(id))

  res.json(post);
})

//CHALLENGE 5: DELETE a specific post by providing the post id.
app.delete('/posts/:id',async(req,res)=>{
  const id = req.params.id
  if (!id) return res.status(404).json({ message: "Post not found" });

  const a = await blog.findByIdAndDelete(id)
  res.json({ message: "Post deleted" });
})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
