const mongoose =  require('mongoose')


mongoose.connect("mongodb+srv://admin:sanchit111...@cluster0.hgdc9.mongodb.net/userManagement?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log(`connection Sucessfull`)
}).catch((err)=>{
    console.log(`error in connection ${err}`)
})
