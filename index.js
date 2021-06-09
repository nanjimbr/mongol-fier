const fs = require( 'fs' ),
      path = require( 'path' ),
      Twit = require( 'twit' ),
      config = require( path.join( __dirname, 'config.js' ) );

const T = new Twit( config );

function randomFromArray( images ){
  return images[Math.floor( Math.random() * images.length )];
}

function tweetRandomImage(){

  fs.readdir( __dirname + '/images', function( err, files ) {
    if ( err ){
      console.log( 'error:', err );
      return;
    }
    else{
      let images = [];
      files.forEach( function( f ) {
        images.push( f );
      } );

      console.log( 'opening an image...' );

      const imagePath = path.join( __dirname, '/images/' + randomFromArray( images ) ),
            b64content = fs.readFileSync( imagePath, { encoding: 'base64' } );

      console.log( 'uploading an image...', imagePath );

      T.post( 'media/upload', { media_data: b64content }, function ( err, data, response ) {
        if ( err ){
          console.log( 'error:', err );
        }
        else{
          console.log( 'image uploaded, now tweeting it...' );

          T.post( 'statuses/update', {
            media_ids: new Array( data.media_id_string )
          },
            function( err, data, response) {
              if (err){
                console.log( 'error:', err );
              }
              else{
                console.log( 'posted an image!' );

                /*fs.unlink( imagePath, function( err ){
                    if ( err ){
                        console.log( 'error: unable to delete image ' + imagePath );
                    }
                    else{
                        console.log( 'image ' + imagePath + ' was deleted' );
                    }
                });*/
              }
            }
          );
        }
      } );
    }
  } );
}

setInterval( function(){
  tweetRandomImage();
}, 50000 );