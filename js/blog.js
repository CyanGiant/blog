$(function() {

    Parse.$ = jQuery;

    Parse.initialize("Ea78s9QiTCskbiLZirAyhq591UjlQ6vXJYNm81G9", "CFwJjWiD3P7MBZbRYQiTNofDoa5VJVzp9YRlog67");

  var Blog      = Parse.Object.extend("Blog");
  var Blogs     = Parse.Collection.extend({
      model: Blog
  });
  var blogs  = new Blogs();
  blogs.fetch({
    success: function(blogs) {
      var blogsView = new BlogsView({ collection: blogs });
      blogsView.render();
      $('.main-container').html(blogsView.el);
    },
    error: function(blogs, error) {
      console.log(error);
    }
  });
  var BlogsView = Parse.View.extend({
    template: Handlebars.compile($('#blogs-tpl').html()),
    render: function(){
      var collection = { blog: this.collection.toJSON() };
      this.$el.html(this.template(collection));
    }
  });
});
