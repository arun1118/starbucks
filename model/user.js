const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    orders: [
        [
            {
                name: {type: String, required: true},
                quantity: {type: Number, required: true}
            }
        ]
    ]
});

UserSchema.methods.addOrders= async function(orderItemsVal){ // any manipulation with databse, we need SchemaName.methods.FunctionName 
    try{ 
        this.orders=this.orders.concat([orderItemsVal]);
        await this.save();

        return this.orders; // to store the token in cookies, we need to return back to auth.js
    } catch(error) {
        console.log("error in storing orders "+error);
    }
}

const User=mongoose.model('user',UserSchema);

module.exports=User;