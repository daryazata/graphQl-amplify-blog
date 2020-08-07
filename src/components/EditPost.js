import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { updatePost } from '../graphql/mutations';

export default class EditPost extends Component{


    state = {
      
        show:false,

        postData:{

         id: this.props.id,
         postOwnerId: this.props.postOwnerId,
         postOwnerUsername: this.props.postOwnerUsername,
         postTitle: this.props.postTitle,
         postBody: this.props.postBody,
         createdAt: this.props.createdAt,
         //comments: this.props.comments,
        // likes: this.props.likes

        }

    }
    handleTitle = (event) =>{
        this.setState({
            
            postData:{...this.state.postData, 
                        postTitle: event.target.value}
        })
    }

    handleBody = (event) =>{
        this.setState({
            
            postData:{...this.state.postData, 
                         postBody: event.target.value}
        })
    }
    
    handleUpdatePost= async (event) =>{
        event.preventDefault()
        let {updatedAt}= this.state.postData
        const input ={
                   
              ...this.state.postData,
 
        }
        console.table(input)
        await API.graphql(graphqlOperation(updatePost,{input}))

       //force close the modal
       this.setState({show: false})

    }


    handleModel = () => {
            this.setState({
                show: !this.state.show
            })
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
    }
    componentDidMount = async() =>{
       
        await Auth.currentUserInfo()
        .then(user=>{
           
            this.setState({
                postOwnerId : user.attributes.sub,
                postOwnerUsername : user.username
            })
        })
    }

    render(){
       // console.log(this.props)
        return (
            <>
            {this.state.show && (

                <div className="modal">
                    <button className="close" onClick={this.handleModel} >X</button>
                    <form className="add-post"
                        onSubmit={event => this.handleUpdatePost(event) }
                    >
                        <input style={{fontSize: "19px"}}
                            type="text"
                            placeholder="Title"
                            name = "postTitle"
                            value = {this.state.postData.postTitle}
                            onChange = {event => this.handleTitle(event)}

                        />
                        <input style={{fontSize: "19px", height:"150px"}}
                            type="text"
                            placeholder="Comment"
                            name = "postBody"
                            value = {this.state.postData.postBody}
                            onChange = {event => this.handleBody(event)}

                        />

                        <button>Update Post</button>
                        

                    </form>
                
                </div>
            )
            
        }
        <button onClick={this.handleModel} >Edit</button>
            
            
            </>
        )
    }
}