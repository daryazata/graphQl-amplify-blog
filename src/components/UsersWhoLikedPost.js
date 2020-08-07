import React, {  Component } from 'react';

export default class UsersWhoLikedPost extends Component{

    render(){

        const allUsers= this.props.data
        console.log(allUsers)
        return( allUsers.map((user, index)=>{
            console.log(user)
            console.log(index)
            
            return(
        
            
            <div key ={index}>

                <span  style={{fontStyle: "bold", color:"#ged"}}>
                    {user}
                </span>


            </div>

            )

        })
        )
    }



}