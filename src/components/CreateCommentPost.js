import React, { Component } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { createComment } from '../graphql/mutations';
import CommentPost from './CommentPost'


export default class CommentsPost extends Component{

    state = {
        commentOwnerId:"",
        commentOwnerUsername:"",
        content:""

    }

    componentDidMount = async ()=>{
         
        await Auth.currentUserInfo()
        .then(user=>{
           
            this.setState({
                commentOwnerId : user.attributes.sub,
                commentOwnerUsername : user.username
            })
        })
    }

    handleChangeContent = event =>{
        this.setState({content: event.target.value})
    }

    handleAddComment = async event => { 

        event.preventDefault()

        const input ={

            commentPostId : this.props.postId,
            commentOwnerId: this.state.commentOwnerId,
            commentOwnerUsername : this.state.commentOwnerUsername,
            content: this.state.content,
            createdAt: new Date().toISOString()
        }
        console.table(input)

        await API.graphql(graphqlOperation(createComment, {input}))

        this.setState({ content:""}
        , 
        )
     }

    render(){
        return(
        <>
            <form className="add-comment"
                onSubmit= {this.handleAddComment }
            >
                <textarea
                  type = "text"
                  name = "content"
                  rows = "3"
                  cols = "40"
                  required
                  placeholder = "Add Your Comment"
                  value = {this.state.content}
                  onChange = {event => this.handleChangeContent(event) }  
                />

                <input
                type = "submit"
                className="btn"
                style= {{fontSize:'19'}}
                value = "Add Comment"
                />
            </form>

           {/*  <CommentPost {...this.state}/> */}

        </>
        )

    }
}