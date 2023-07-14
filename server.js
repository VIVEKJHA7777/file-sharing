const express=require('express');
const app=express();
const ejs=require('ejs');


const PORT=process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));
const connectDB=require('./config/db');
 connectDB();

 
//Routes
app.use('/api/files',require('./routes/files'))
app.use('/files',require('./routes/show.js'));

app.set('view engine','ejs');
 app.use('/files/download',require('./routes/download'))

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})