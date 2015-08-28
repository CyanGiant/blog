$(function() {

    Parse.$ = jQuery;
 
    Parse.initialize("Ea78s9QiTCskbiLZirAyhq591UjlQ6vXJYNm81G9", "CFwJjWiD3P7MBZbRYQiTNofDoa5VJVzp9YRlog67");

    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();
    testObject.save({foo: "bar"}).then(function(object) {
      alert("yay! it worked");
    });

});
