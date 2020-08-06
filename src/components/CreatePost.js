import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createPost } from '../graphql/mutations';

export default class CreatePost extends Component{

    state = {
    
      postOwnerId:'',
      postOwnerUsername:'',
      postTitle:'',
      postBody:'',
      createdAt:'',
      comments :'',
      
    }

    componentDidMount = async ()=>{
            
        await Auth.currentUserInfo()
        .then(user=>{
            console.log("user name", user.username)
            console.log("user attrib", user.attributes.sub)
           
            this.setState({
                postOwnerId : user.attributes.sub,
                postOwnerUsername : user.username
            })
        })
    }

    handleChangepost = event => this.setState({
        //putting all values in the array
        [event.target.name] :event.target.value
      
        
    }, 
 //()=>  console.log( this.state)
     )

    handleAddPost= async event =>{
        event.preventDefault()

        const input ={
               
                postOwnerId: this.state.postOwnerId,
                postOwnerUsername: this.state.postOwnerUsername,
                postTitle: this.state.postTitle,
                postBody:  this.state.postBody,
                createdAt: new Date().toISOString(),
              //  comments : this.state.comments
        }

        await API.graphql(graphqlOperation(createPost,{input}))

        this.setState({postBody:"", postTitle:""})
    }
    render(){

        return (

            <form className="add-post" 
            onSubmit ={this.handleAddPost}>

                <input style={{font:'19px'}}
                    type="text" placeholder="title"
                    name="postTitle"
                    required
                    // here value = this state works, because state gets update on every single change 
                    value = {this.state.postTitle}
                    onChange={this.handleChangepost}

                />
                <textarea
                    type = "text"
                    name = "postBody"
                    rows = "3"
                    cols  = "40"
                    required
                    placeholder="New Blog Post"
                    value = {this.state.postBody}
                    onChange={this.handleChangepost}
                />
                <input 
                    type = "submit"
                    className = "btn"
                    style = {{fontSize:"19px"}}
                
                />

            </form>
        )
    }
}