import React, { Component } from 'react';

export default class CommentPost extends Component{

    render (){
        const {content, commentOwnerUsername, createdAt} = this.props.commentData
        
    
        return(
            <div>
                <span style = {{fontStyle: "italic", color:'#0ca5e297'}}>
                    {"Comment by: "} {commentOwnerUsername}
                    {" on "}
                <time style={ {fontStyle : "italic"}}>
                    { " "}
                    {new Date(createdAt).toDateString()}
                </time>
                </span>
                <p>{ content }</p>

            </div>

        )
    }
}