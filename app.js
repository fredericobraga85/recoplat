const express = require('express');
const app = express();

app.use(express.static(__dirname + '/template'));

const routes = require('./routes/router')
app.use('/', routes)

app.use((req,res,next)=>{
	var err = new Error('File Not Found');
	err.status = 404;
	next(err);
})

app.use((err,req,res,next)=>{
	res.status(err.status || 500)
	res.json('error', {
		message: err.message,
		error:{}
	})
})

app.listen(3000, ()=>{
	console.log('Express app listening on port 3000')
})


