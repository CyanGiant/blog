$(function() {

    Parse.$ = jQuery;

    Parse.initialize("Ea78s9QiTCskbiLZirAyhq591UjlQ6vXJYNm81G9", "CFwJjWiD3P7MBZbRYQiTNofDoa5VJVzp9YRlog67");

    var LoginView = Parse.View.extend({
          template: Handlebars.compile($('#login-tpl').html()),
          events: {
            'submit .form-signin': 'login'
          },
          login: function(e) {

            // Prevent Default Submit Event
            e.preventDefault();

            // Get data from the form and put them into variables
            var data = $(e.target).serializeArray(),
              username = data[0].value,
              password = data[1].value;

            // Call Parse Login function with those variables
            Parse.User.logIn(username, password, {
              // If the username and password matches
              success: function(user) {
                // var welcomeView = new WelcomeView({model: user});
                // welcomeView.render();
                // $('.main-container').html(welcomeView.el);
                blogRouter.navigate('admin', {trigger: true });
              },
              // If there is an error
              error: function(user, error) {
                console.log(error);
              }
            });
          },
          render: function(){
            this.$el.html(this.template());
          }
        }),

        WelcomeView = Parse.View.extend({
          template: Handlebars.compile($('#welcome-tpl').html()),
          events:{
            'click .add-blog': 'add'
          },
          add: function(){
            blogRouter.navigate('add', {trigger: true});
          //   var addBlogView = new AddBlogView();
          //   addBlogView.render();
          //   $('.main-container').html(addBlogView.el);
          },
          render: function(){
            var attributes = this.model.toJSON();
            this.$el.html(this.template(attributes));
            // this.$el.html(this.template()).find('textarea').wysihtml5();
            // var blogs = new Blogs();
            // blogs.fetch({
            //   success: function(blogs) {
            //     var blogsAdminView = new BlogsAdminView({ collection: blogs });
            //     blogsAdminView.render();
            //     $('.main-container').append(blogsAdminView.el);
            //   },
            //   error: function(blogs, error) {
            //     console.log(error);
            //   }
            // });
          }
        });

        // var loginView = new LoginView();
        // loginView.render();
        // $('.main-container').html(loginView.el);

        AddBlogView = Parse.View.extend({
          template: Handlebars.compile($('#add-tpl').html()),
          events:{
            'submit .form-add': 'submit'
          },
          submit: function(e){
            //prevent default submit event
            e.preventDefault();
            //grab form and put into data object
            var data = $(e.target).serializeArray(),
            //create new Blog instance
              blog = new Blog();
            // Call .create
            blog.create(data[0].value, $('textarea').val());
          },
          render: function(){
            this.$el.html(this.template());
            this.$el.html(this.template()).find('textarea').wysihtml5();
          }
        });

        EditBlogView = Parse.View.extend({
          template: Handlebars.compile($('#edit-tpl').html()),
          events: {
            'submit .form-edit': 'submit'
          },
          submit: function(e) {
            e.preventDefault();
            var data = $(e.target).serializeArray();
            this.model.update(data[0].value, $('textarea').val());

          },
          render: function(){
            var attributes = this.model.toJSON();
            this.$el.html(this.template(attributes));
          }

        });


        var Blog = Parse.Object.extend('Blog', {
          create: function(Title, Content){
            this.save({
              'Title': Title,
              'Content': Content,
              'author': Parse.User.current(),
              'authorName': Parse.User.current().get('username'),
              'time': new Date().toDateString()
            }, {
              success: function(blog){
                alert('You added a new blog: ' + blog.get('Title'));
              },
              error: function(blog, error) {
                console.log(blog);
                console.log(error);
              }
            });
          },
          update: function(Title, Content) {
            this.set({
              'Title': Title,
              'Content': Content
            }).save(null, {
              success: function(blog) {
                alert('The blog ' + blog.get('Title') + ' has been saved!');
              },
              error: function(blog, error) {
                console.log(blog);
                console.log(error);
              }
            });
          }
        });
        var Blogs = Parse.Collection.extend({
          model: Blog
        }),
        BlogsAdminView = Parse.View.extend({
          template: Handlebars.compile($('#blogs-admin-tpl').html()),
          render: function() {
            var collection = { blog: this.collection.toJSON() };
            this.$el.html(this.template(collection));
          },
          events: {
            'click .app-edit': 'edit'
          },
          edit: function(e){
            e.preventDefault();
            var href = $(e.target).attr('href');
            blogRouter.navigate(href, {trigger: true });
          }

        });
        var BlogRouter = Parse.Router.extend({

          //Define shared vairables

          initialize: function(options){
            this.blogs = new Blogs();
          },

          add: function(){
            var addBlogView = new AddBlogView();
            addBlogView.render();
            $('.main-container').html(addBlogView.el);
          },

          //Start Router
          start: function(){
            Parse.history.start({pushState: true});
            this.navigate('admin', {trigger: true });
          },

          //map functions to urls
          //just add '{{URL pattern=}}' : '{{functoin name}}'
          routes:{
            'admin'    : 'admin',
            'login'    : 'login',
            'add'      : 'add',
            'edit/:id' : 'edit'
          },

          admin: function() {
            var currentUser = Parse.User.current();

            if (!currentUser) {
              blogRouter.navigate('login', {trigger: true});
            } else {

              var welcomeView = new WelcomeView({model: currentUser});
              welcomeView.render();
              $('.main-container').html(welcomeView.el);

              this.blogs.fetch({
                success: function(blogs) {
                  var blogsAdminView = new BlogsAdminView({ collection: blogs});
                  blogsAdminView.render();
                  $('.main-container').append(blogsAdminView.el);
                },
                error: function(blogs, error) {
                  console.log(error);
                }
              });
            }
          },
          login: function() {
            var loginView = new LoginView();
            loginView.render();
            $('.main-container').html(loginView.el);
          },
          // add  : function() {},
          edit : function(id) {
            var query = new Parse.Query(Blog);

            query.get(id, {
              success: function(blog) {
                var editBlogView = new EditBlogView({ model: blog });
                editBlogView.render();
                $('.main-container').html(editBlogView.el);
              },
              error: function(blog, error) {
                console.log(error);
              }
            });
          }
        }),
        blogRouter = new BlogRouter();

      blogRouter.start();


});
