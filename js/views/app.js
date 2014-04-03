// js/views/app.js

var app = app || {};

// The Application
// ---------------

app.AppView = Backbone.View.extend({
  //element to bind to
  el: '#todoapp',

  //stats template
  statsTemplate: _.template( $('#stats-template').html() ),

  //initilize view
  initialize: function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$main = this.$('#main');
    this.$footer = this.$('#footer');

    //listeners
    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);
  },

  //add
  addOne: function(todo) {
    var view = new app.TodoView({ model: todo });
    $('#todo-list').append( view.render().el );
  },

  //reset
  reset: function() {
    this.$('#todo-list').html('');
    app.Todos.each(this.addOne, this);
  }


});
