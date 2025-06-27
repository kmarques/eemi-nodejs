use("SampleCollections");
// Question 1 : Baptiste
db.Sakila_films.find({
  Description: {
    $regex: "documentary",
    $options: "i",
  },
  Category: /horror/i,
});
// Question 2 : Thierry
db.Sakila_films.countDocuments({
  Rating: "G",
});
db.Sakila_films.find({
  Rating: "G",
}).count();
db.Sakila_films.find({
  Rating: "G",
}).toArray().length;
// Qestion 3 : Antony
db.video_movieDetails.find({
  year: { $in: [2012, 2013] },
  runtime: { $gte: 60, $lte: 150 },
});
// Question 4 : Thierry
db.video_movieDetails.find({
  "tomato.image": "certified",
});
// Question 5 : Allan/Antony
db.Sakila_films.find({
  Actors: {
    $elemMatch: {
      "First name": "ED",
      "Last name": "CHASE",
    },
  },
});
db.Sakila_films.find({
  "Actors.First name": "ED",
  "Actors.Last name": "CHASE",
});
// Question 6 : Lilian
db.Sakila_films.aggregate([
  { $group: { _id: "$Rating", nb_films: { $sum: 1 } } },
]);
db.Sakila_films.aggregate([
  { $unwind: "$Actors" },
  {
    $group: {
      _id: {
        actorId: "$Actors.actorId",
        "First name": "$Actors.First name",
        "Last name": "$Actors.Last name",
      },
      movies: {
        $addToSet: {
          title: "$Title",
          year: "$Year",
          rating: "$Rating",
        },
      },
      nb_films: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: "$_id.actorId",
      "First name": "$_id.First name",
      "Last name": "$_id.Last name",
      movies: "$movies",
      nb_films: "$nb_films",
    },
  },
  {
    $out: "Sakila_actors_movies",
  },
]);
db.Sakila_actors_movies.find({
  "First name": "ED",
  "Last name": "CHASE",
});
