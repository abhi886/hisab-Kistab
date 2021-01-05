// Changed on jan 5
const express = require('express');
const app = express();


app.get('/', (req, res) =>{
    res.send('hello world');
});


app.listen(3000, ()=> console.log('Listening to port 3000'));
