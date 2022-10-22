// const ObjectId = require('mongodb').ObjectId;
// const { validationResult } = require('express-validator');
let errors;

module.exports = (dependencies) => {
    const router = dependencies.router();

    router.get('/', (request, response, next) => {
        // #swagger.path = '/songs'
        // #swagger.tags = ['Song']
        // #swagger.description = 'Get list of all songs'
        try {
            const result = dependencies.models.song.find();
            result
              .then((lists) => {
                response.setHeader('Content-Type', 'application/json');
                response.status(200).json(lists);
                //console.log(lists);
              })
              .catch((e) => {
                console.error(e);
              });
          } catch (e) {
            console.error(e);
          }
    });

    router.get('/:song_id', (request, response, next) => {
        /*
            #swagger.parameters['song_id'] = {
                in: 'path',
                description: 'The ID of the song to retrieve',
                required: true,
                type: 'string'
            }
            #swagger.path = '/songs/{song_id}'
            #swagger.tags = ['Song']
            #swagger.description = 'Get a specific song by song_id'
        */
            const id = request.params.song_id;
            //console.log(id);
            try {
                const result = dependencies.models.song.findOne({_id:id});
                result
                  .then((lists) => {
                    response.setHeader('Content-Type', 'application/json');
                    response.status(200).json(lists);
                    //console.log(lists);
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              } catch (e) {
                console.error(e);
              }
    });

    //We are not using this route but I have it here in case we want it in the future
    router.get('/genre/:genre_id', (request, response, next) => {
        /*
            #swagger.parameters['genre_id'] = {
                in: 'path',
                description: 'The ID of the genre to retrieve songs of',
                required: true,
                type: 'string'
            }
            #swagger.path = '/songs/genre/{genre_id}
            #swagger.tags = ['Song']
            #swagger.description = 'Get a list of songs by genre_id'
        */
            const id = JSON.stringify(request.params.genre_id);
            let songsListByGenre = [];
            try {
                const result = dependencies.models.song.find();
                result
                  .then((song) => {
                    response.setHeader('Content-Type', 'application/json');
                    for (i of song){
                        for (j of i.genres){
                            let k = JSON.stringify(j)
                            if(id == k){
                                songsListByGenre.push(i);
                            }
                        }
                    }
                    response.status(200).json(songsListByGenre);
                  })
                  .catch((e) => {
                    console.error(e);
                  });
                  ;
              } catch (e) {
                console.error(e);
              }
    });

    // The second callback over here makes authentication required for this endpoint
    router.post(
        '/', 
        dependencies.requires_authentication(), 
        dependencies.validate.songValidation, 
        (req, res, next) => {
            errors = dependencies.validate.validationResult(req);
            if (!errors.isEmpty()) {
              console.log(errors.mapped());
              console.log('errors');
            } else {
              next();
            }
          }, 
        (request, response, next) => {
        /*
            #swagger.path = '/songs'
            #swagger.tags = ['Song']
            #swagger.description = 'Insert new song to the collection'
            #swagger.parameters['obj'] = {
                in: 'body',
                '@schema': {
                    "required": ["title", "release_year", "rating", "summary", "artist"],
                    "properties": {
                        "title": {
                            "type": "string",
                            "example": "Some title..."
                        },
                        "release_year": {
                            "type": "string",
                            "example": "Some release year..."
                        },
                        "rating": {
                            "type": "number",
                            "example": "Some rating..."
                        },
                        "summary": {
                            "type": "string",
                            "example": "Some summary..."
                        },
                        "artist": {
                            "type": "string"
                        }
                    } 
                }
            }
        */
            let newSong = new dependencies.models.song();
            newSong.title = request.body.title;
            newSong.release_year = parseInt(request.body.release_year);
            newSong.rating = parseInt(request.body.rating);
            newSong.summary = request.body.summary;
            newSong.artist = request.body.artist;
            // These lines were used in the previous model:
                // newSong.artists = [];
                // for (i of request.body.artists){
                //     newSong.artists.push(new ObjectId(i));
                // };
                // newSong.genres = [];
                // for (i of request.body.genres){
                //     newSong.genres.push(new ObjectId(i));
                // };
                // newSong.reviews = [];
                // for (i of request.body.reviews){
                //     newSong.reviews.push(new ObjectId(i));
                // };
            newSong.save((error, result)=>{
                    if(error){
                        return response.status(500).json(response.error || 'Some error occurred while creating the contact.');
                    }
                    response.status(201).send('You are at /songs (POST)');
                })
        });

    router.put(
        '/:song_id', 
        dependencies.requires_authentication(), 
        dependencies.validate.songValidation,
        (req, res, next) => {
            errors = dependencies.validate.validationResult(req);
            if (!errors.isEmpty()) {
              console.log(errors.mapped());
              console.log('errors');
            } else {
              next();
            }
          }, 
        (request, response, next) => {
        /*
            #swagger.parameters['song_id'] = {
                in: 'path',
                description: 'The ID of the song to update',
                required: true,
                type: 'string'
            }
            #swagger.path = '/songs/{song_id}'
            #swagger.tags = ['Song']
            #swagger.description = 'Updates a song specified by song_id'
            #swagger.parameters['obj'] = {
                in: 'body',
                '@schema': {
                    "required": ["title", "release_year", "rating", "summary", "artist"],
                    "properties": {
                        "title": {
                            "type": "string",
                            "example": "Some title..."
                        },
                        "release_year": {
                            "type": "string",
                            "example": "Some release year..."
                        },
                        "rating": {
                            "type": "number",
                            "example": "Some rating..."
                        },
                        "summary": {
                            "type": "string",
                            "example": "Some summary..."
                        },
                        "artist": {
                            "type": "string"
                        }
                    } 
                }
            }
        */
        const id = request.params.song_id;
        // These commented lines were working with the previous model. I leave them here in case we go back to the other model:
            // let updatedSong = new dependencies.models.song();
            // updatedSong.artists = [];
                // for (i in request.body.artists){
                //     updatedSong.artists.push(new ObjectId(i));
                // };
                // updatedSong.genres = [];
                // for (i of request.body.genres){
                //     updatedSong.genres.push(new ObjectId(i));
                // };
                // updatedSong.reviews = [];
                // for (i of request.body.reviews){
                //     updatedSong.reviews.push(new ObjectId(i));
                // };
        dependencies.models.song.findByIdAndUpdate(
            id,
            {
                title: request.body.title,
                release_year:parseInt(request.body.release_year),
                rating:parseInt(request.body.rating),
                summary:request.body.summary,
                artists:request.body.artists,
                //These lines were also compatible with previous model:
                //genres:updatedSong.genres,
                // reviews:updatedSong.reviews
            },
            function (err, res){
                if(err){
                    return response.status(500).json(response.error || 'Some error occurred while updating the contact.');
                }
                else{
                    response.status(204).send('You are at /:song_id (PUT)');
                }
            }
            );
    });

    router.delete('/:song_id', dependencies.requires_authentication(), (request, response, next) => {
        /*
            #swagger.parameters['song_id'] = {
                in: 'path',
                description: 'The ID of the song to delete',
                required: true,
                type: 'string'
            }
            #swagger.path = '/songs/{song_id}'
            #swagger.tags = ['Song']
            #swagger.description = 'Deletes a song specified by song_id'
        */
            const id = request.params.song_id;
            dependencies.models.song.findByIdAndDelete(
                id,
                function(err, data) {
                    if(err){
                        //console.log(err);
                    }
                    else{
                        response.status(200).send(data);
                        //console.log("Data Deleted!");
                    }
                })
    });

    return router;
};