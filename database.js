const books= [
 {
   ISBN: "1234567Book",
   title:"Tesla",
   pubDate:"2023-06-10",
   language:"en",
   numPage:250,
   author:[1,2],
   publications: [1],
   category: ["tech","space","education"]
}
]

const author=[
  {
    id:1,
    name:"Alan",
    books:["1234567Book","Secret Book"]
 },
 {
   id:2,
   name:"XYZ",
   books:["1234567Book"]
 }
]

const publication =[
  {
    id:1,
    name:"writex",
    books:["1234567Book"]
  },

  {
      id:2,
      name:"writex2",
      books:[]
  }
]

module.exports={ books,author,publication};
