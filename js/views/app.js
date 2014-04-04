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
    this.listenTo(app.Todos, 'change:completed', this.filterOne);
    this.listenTo(app.Todos, 'filter', this.filterAll);
    this.listenTo(app.Todos, 'all', this.render);

    app.Todos.fetch();
  },

  //events : {"event selector": "callback"}
  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },


    // Re-rendering the App just means refreshing the statistics //TODO - check for updates?
    render: function() {
      var completed = app.Todos.completed().length;
      var remaining = app.Todos.remaining().length;

      if ( app.Todos.length ) {
        this.$main.show();
        this.$footer.show();

        this.$footer.html(this.statsTemplate({
          completed: completed,
          remaining: remaining
        }));

        this.$('#filters li a')
          .removeClass('selected')
          .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
          .addClass('selected');
      } else {
        this.$main.hide();
        this.$footer.hide();
      }

      this.allCheckbox.checked = !remaining;
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
  },

  //filterOne
  filterOne: function(todo){
    todo.trigger('visible');
  },

  //filterAll
  filterAll: function(){
    app.Todos.each(this.filterOne, this);
  },
  //create default/correct attributes for new todos
  newAttributes: function() {
      return {
        title: this.$input.val().trim(),
        order: app.Todos.nextOrder(),
        completed: false
      };
    },

    //on ENTER create event
    createOnEnter: function( event ) {
      if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
        return;
      }

      app.Todos.create( this.newAttributes() );
      this.$input.val('');
    },

    // Clear all completed todo items, destroying their models.
    clearCompleted: function() {
      _.invoke(app.Todos.completed(), 'destroy');
      return false;
    },

    // New
    toggleAllComplete: function() {
      var completed = this.allCheckbox.checked;

      app.Todos.each(function( todo ) {
        todo.save({
          'completed': completed
        });
      });
    }
});
