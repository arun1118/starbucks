const mongoose=require('mongoose');

const ItemSchema=new mongoose.Schema({
    name: {type: String, required: true,},
    price: {type: Number, required: true}
});

const Item=mongoose.model('item',ItemSchema);

module.exports=Item;