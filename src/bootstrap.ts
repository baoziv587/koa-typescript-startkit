var server =require( './server')
var PORT = process.env.PORT || 3000;

//start app
if (!module.parent) {
  server.listen(PORT, function () {
    console.log('started server');
  });
  
}
