// js/todo/todo.js

var app = app || {};

// Todo Model
// ----------
// Our basic **Todo** model has `title` and `completed` attributes.

app.Todo = Backbone.Model.extend({

  //defaults
  defaults: {
    title: '',
    completed: false
  },

  //toggle 'completed' state
  toggle: function() {
    this.save({
      completed = !this.get('completed')
    });
  }
})
