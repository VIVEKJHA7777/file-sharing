const express=require('express');
const app=express();
const ejs=require('ejs');
const cors=require('cors');


const PORT=process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));
const connectDB=require('./config/db');
 connectDB();

 //cors
const corsOptions={
    //if multiple domain name
   // origin:['http://localhost:3000','http://localhost:5000']
   origin:process.env.ALLOWED_CLIENTS.split(',')

}
app.use(cors(corsOptions));

//template engine
app.set('view engine','ejs');
 
//Routes
app.use('/api/files',require('./routes/files'))
app.use('/files',require('./routes/show.js'));
app.use('/files/download',require('./routes/download'))

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})