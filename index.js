require("dotenv").config();
const express= require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database/database");

//Models
const BookModel=require("./database/book");
const AuthorModel=require("./database/author");
const PublicationModel=require("./database/publication");

//initialise express
const booky=express();

booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser : true ,
  useUnifiedTopology : true,
  //useFindAndModify: false,
  //useCreateIndex: true
}
).then(() => console.log("Connection Established!"));


/*API Description
Route        /
Description  Get all books
Access       Public
Parameter    none
Methods      Get
*/

booky.get("/",async(req,res) => {
  const getAllBooks = await BookModel.find();
  return  res.json(getAllBooks);
 }
);
/*API Description
Route        /is
Description  Get specific Books baesd on ISBN number
Access       Public
Parameter    isbn
Methods      Get
*/

/*booky.get("/",(req,res) => {
  return res.json({books:database.books});
});

booky.get("/is/:isbn", async(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );
  if(getSpecificBook.length === 0){
     return res.json({error:`No found for the ISBN number entered ${req.params.isbn}`});
  }

   return res.json({book:getSpecificBook});
});*/

//using mongodb
booky.get("/is/:isbn",async(req,res) => {
  const getSpecificBook= await BookModel.findOne({ISBN:req.params.isbn});
//null-0!=1 and vice-versa
  if(!getSpecificBook){
    return res.json({error:`No book found for the book of ISBN number : ${req.params.isbn}`});
  }

  return res.json({book:getSpecificBook});
});

/*API Description
Route        /
Description  Get all the Books belonging to a certain category
Access       Public
Parameter    category
Methods      Get
*/

/*booky.get("/c/:category", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category) //includes() function is used to check whether an array contains a specific element;here,category is an array with multiple elements;so to compare each element, we use includes
  )*/
booky.get("/ca/:category",async(req,res) => {
  const getSpecificBook= await BookModel.findOne({category:req.params.category});

  if(!getSpecificBook)
  {
    return res.json({error:`No book found for the given category of ${req.params.category}`})
  }

  return res.json({book:getSpecificBook});
});

/*API Description
Route        /
Description  Get all the Books belonging to a certain language
Access       Public
Parameter    category
Methods      Get
*/

booky.get("/l/:language",(req,res) => {
   const getSpecificBook = database.books.filter(
     (book) => book.language=== req.params.language
   );


  if(getSpecificBook.length===0){
     return res.json({error:`No books found in the language ${req.params.language}`});
  }

  return res.json({book:getSpecificBook});
})


/*API Description
Route        /author
Description  Get all the authors
Access       Public
Parameter    None
Methods      Get
*/

booky.get(("/author"),async(req,res) => {
  const getAllAuthors =  await AuthorModel.find();
  return res.json(getAllAuthors)
})

/*API Description
Route        /author
Description  Get all the authors
Access       Public
Parameter    None
Methods      Get
*/

  booky.get("/author/books/:isbn",(req,res) => {
    const getSpecificAuthor = database.author.filter(
      (author) => author.books.isbn === req.params.isbn)

  if(getSpecificAuthor.length===0){
    return res.json({error:`No authors found for the book with ISBN: ${req.params.isbn}`});
  }

  return res.json({author:getSpecificAuthor});
  })

/*API Description
Route        /author/book
Description  Get all the authors based on a caetgory of books
Access       Public
Parameter    isbn
Methods      Get
*/

  /*booky.get("/author/book/:isbn",(req,res) => {
     const getSpecificAuthor = database.author.filter(
       (author) => (author.books.includes(req.params.isbn))
  )

  if(getSpecificAuthor.length === 0){
    return res.json({error:`No author found for the book with ISBN number${req.params.isbn}`});
  }

  return res.json({author:getSpecificAuthor});
});*/


//using mongodb
booky.get("/c/:category",async(req,res) => {
  const getSpecificBook= await BookModel.findOne({category:req.params.category});

  if(!getSpecificBook){
    return res.json({error:`No book found for the book of category : ${req.params.category}`});
  }

  return res.json({book:getSpecificBook});
});

/*API Descriptions
Route        /publications
Description  Get all the publications
Access       Public
Parameter    None
Methods      Get
*/

booky.get("/publications",async(req,res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
})

/*API Description
Route        /pu
Description  Get a specific publication
Access       Public
Parameter    isbn
Methods      Get
*/

booky.get("/pu/:isbn",(req,res) => {
    const getSpecificPublication = database.publication.filter(
      (publication) => (publication.books.includes(req.params.isbn))
    );


   if(getSpecificPublication.length === 0){
     return res.json({error:`No author found for the publication ${req.params.id}`});
   }

  return res.json({publication:getSpecificPublication});

})


/*API Description
Route        /book/new
Description  Add new books
Access       Public
Parameter    none
Methods      post
*/
//destructuring required
 booky.post("/book/new",async(req,res) =>{
   const { newBook} =  req.body;
   const addNewBook =  BookModel.create(newBook);
   return res.json({
     books: addNewBook,
     message: "Book was added!!"
   });
 });

 /*************PUT************/
 //using mongodb Operators

booky.put("/book/update/:isbn", async (req,res)=> {
    const updatedBook= await BookModel.findOneAndUpdate(
      {
        ISBN: req.params.isbn
      },
      {
        title : req.body.bookTitle
      },
      {
        new: true
      });
  return res.json({
    books: updatedBook});
});

/*API Description
Route        /book/Delete
Description  Delete a book
Access       Public
Parameter    isbn
Methods      delete
*/

booky.put("/book/author/update/:isbn", async (req,res) =>{
  //Update book database
  //Update author database
  const updatedBook= await BookModel.findOneAndUpdate(
    {
      ISBN:req.params.isbn
    },
    {
      $addToSet :{
        authors:req.body.newAuthor
      }
    },
    {
      new: true
    }
  );

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor
    },
    {
      $addToSet:{
        books: req.params.isbn
      }
    },
    {
      new: true
    }
  );

  return res.json({
    books:updatedBook,
    authors:updatedAuthor,
    message:"Changes were made succesfully!!"
  });
});


/*booky.post("/book/new",(req,res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks:database.books});
});

/*API Description USING mongodb
Route        /author/new
Description  Add new author
Access       Public
Parameter    none
Methods      post
*/

booky.post("/author/new",async(req,res) =>{
  const { newAuthor} = req.body; //destructuring
  const addNewAuthor  = AuthorModel.create(newAuthor);
  return res.json({
     author:addNewAuthor,
     message: "New author added successfully!"
  });
});

/*API Description
Route        /publication/new
Description  Add new author
Access       Public
Parameter    none
Methods      post
*/

booky.post("/author/new",(req,res) => {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json({updatedAuthor:database.author});
})

/*API Description
Route        /publication/new
Description  Add new publication
Access       Public
Parameter    none
Methods      post
*/

booky.post("/publication/new", async(req,res) =>{
  const {newPublication}= req.body;
  const addNewPublication = PublicationModel.create(newPublication);
  return res.json({
    publication:addNewPublication,
    message:"New publication added successfully!"
  });
});

/*API Description
Route        /publication/new
Description  Add new publication
Access       Public
Parameter    none
Methods      post
*/

booky.post("/publication/new",(req,res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json({updatedPublications:database.publication});
})
/*API Description
Route        /publication/new
Description  Add new publication
Access       Public
Parameter    none
Methods      post
*/

/*{
  "pubId":2
}*/
/*booky.put("/ping",(req,res) =>
{
  console.log("No error");
  return res.json({message:"No error found"});
});*/
booky.put("/publication/update/book/:isbn",(req,res) => {
  //update the publication database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId){
      return pub.books.push(req.params.isbn);
    }
  });

//update the books Database
database.books.forEach((book) => {
  if(book.ISBN === req.body.isbn){
    book.publications.push(req.params.pubId);
    return;
    }

});

 return res.json(
   {
     books:database.books,
     publications:database.publication,
     message:"Successfully updated publications"
   }
 );
});

//DELETE
/*API Description
Route        /book/Delete
Description  Delete a book
Access       Public
Parameter    isbn
Methods      delete
*/

booky.delete("/book/delete/:isbn", async(req,res) =>{
  const updatedBook = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn
    }
  );
  return res.json({
    books: updatedBook
  });
});
/*booky.delete("/book/delete/:isbn",(req,res) => {

  //whichever book which doesnt match with the isbn,just send and rest will be filtered out
   const updatedBookDatabase = database.books.filter(
     (book) => book.ISBN !== req.params.isbn
   )
    database.books=updatedBookDatabase;
    return res.json({books:database.books});
});

/*API Description
Route        /book/delete/author
Description  Delete an author from a book and vice versa
Access       Public
Parameter    isbn,authorid
Methods      delete
*/

booky.delete("/book/delete/author/:isbn/:authorId",(req,res) => {
  //Update the book database
  database.books.forEach((book)=>{
      if(book.ISBN === req.params.isbn ){
        const newAuthorList = book.author.filter(
          (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
        );

        book.author= newAuthorList;
        return;
      }
    });

    //update the author Database
    database.author.forEach((eachAuthor) => {
      if(eachAuthor.id === parseInt(req.params.authorId)) {
        const newBookList = eachAuthor.books.filter(
          (book) => book !== req.params.isbn
        );
    eachAuthor.books= newBookList;
    return;
    }
});

  return res.json({
    book:database.books,
    author:database.author,
   message:"Author was deleted"
 });


});
booky.listen(3000, () => {
  console.log("Server 3000 is up and running ");
})
