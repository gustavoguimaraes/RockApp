App = Ember.Application.create();

// App.Router.map(function() {
//   // put your routes here
// });

App.Artist = Ember.Object.extend({
  name: null,

  slug: function(){
    return this.get('name').dasherize();
  }.property('name'),

  songs: function(){
    return App.Songs.filterProperty('artist', this.get('name'));
  }.property('name', 'App.Songs.@each.artist')
});

App.Song = Ember.Object.extend({
 title: null,
 rating: null,
 artist: null
});

var artistNames = ["Pearl Jam", "Led Zeppelin", "FooFighters", "Kaya Project", "Radiohead", "Silverchair"];

App.Artists = artistNames.map(function(name){
  return App.Artist.create({name: name});
  });

App.Router.map(function(){
  this.resource('artists', function(){
    this.route('songs', {path: ':slug'});
  });
});

App.IndexRoute = Ember.Route.extend({
  //what gets called before when at Index page
  beforeModel: function(){
    this.transitionTo('artists');
  }
});

App.ArtistsRoute = Ember.Route.extend({
  model: function(){
    return App.Artists;
  },
  actions: {
    createArtist: function(){
    var name = this.get('controller').get('newArtist');
    var artist = App.Artist.create({name: name});
    App.Artists.pushObject(artist);
    this.get('controller').set('newArtist', '');
    }
  }
});

App.ArtistsSongsRoute = Ember.Route.extend({
  model: function(params){
    return App.Artists.findProperty('slug', params.slug);
  },
  actions: {
    createSong: function(){
      //short hand notation to th code below
      // var title = this.get('controller.newSong');
      var title = this.get('controller').get('newSong');
      var artist = this.get('controller').get('model').get('name');
      var song = App.Song.create({title: title, artist: artist});
      App.Songs.pushObject(song);
      this.get('controller').set('newSong', '');
    }

  }

});

//Views
//Views have access to their context
App.StarRatingView = Ember.View.extend({
  templateName: 'star-rating',
  classNames: ['rating-panel'],

  rating: Ember.computed.alias('content.rating'),
  numStars:  Ember.computed.alias('maxRating'),
  fullStars: Ember.computed.alias('rating'),

  stars: function() {
    var ratings = [];
    var fullStars = this.starRange(1, this.get('fullStars'), 'full');
    var emptyStars = this.starRange(this.get('fullStars') + 1, this.get('numStars'), 'empty');
    Array.prototype.push.apply(ratings, fullStars);
    Array.prototype.push.apply(ratings, emptyStars);
    return ratings;
  }.property('fullStars', 'numStars'),

  starRange: function(start, end, type) {
    var starsData = [];
    for (var i = start; i <= end; i++) {
      starsData.push({ rating: i, full: type === 'full' });
    }
    return starsData;
  },

  actions: {
    setRating: function() {
      var newRating = Ember.$(event.target).data('rating');
      this.set('rating', newRating);
    }
  }

});

// App.SongCollection = Ember.ArrayProxy.extend(Ember.SortableMixin, {
//  sortProperties: ['rating'],
//  sortAscending: false,
//  content: []
// });

//App.Songs = App.SongCollection.create();
App.Songs = Ember.A();

//Led Zeppelin
App.Songs.pushObject(App.Song.create({title: 'Black Dog', artist: 'Led Zeppelin', rating: 2}));
App.Songs.pushObject(App.Song.create({title: 'Kashmir', artist: 'Led Zeppelin', rating: 3}));
App.Songs.pushObject(App.Song.create({title: 'My Love', artist: 'Led Zeppelin', rating: 4}));

//Radiohead
App.Songs.pushObject(App.Song.create({title: 'Karma Police', artist: 'Radiohead', rating: 5}));
App.Songs.pushObject(App.Song.create({title: 'House of Cards', artist: 'Radiohead', rating: 5}));
App.Songs.pushObject(App.Song.create({title: 'Lotus', artist: 'Radiohead', rating: 3}));

//Sivelchair
App.Songs.pushObject(App.Song.create({title: 'Cemetery', artist: 'Silverchair', rating: 2}));
App.Songs.pushObject(App.Song.create({title: 'Fat Boy', artist: 'Silverchair', rating: 4}));
App.Songs.pushObject(App.Song.create({title: 'Miss You', artist: 'Silverchair', rating: 5}));


//App.alwaysWaiting = App.Song.create({title: 'Yellow LedBetter', artist: 'Pearl Jam', rating: 9});

