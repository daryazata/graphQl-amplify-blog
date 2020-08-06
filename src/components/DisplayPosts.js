import React, { Component } from 'react';
import {listPosts} from '../graphql/queries'
import {API, graphqlOperation} from 'aws-amplify'
import DeletePost from './DeletePosts'
import EditPost from './EditPost'
import '../App.css'
import { onCreatePost } from '../graphql/subscriptions';

export default class DisplayPosts extends Component{


    state={
       posts: []
    }

    componentDidMount = async ()=>{
        this.getPosts()

        // create subscription
        this.createPostListener = API.graphql(graphqlOperation(onCreatePost))
        .subscribe({
            next: postData =>{
                const newPost = postData.value.data.onCreatePost
                const prevPost = this.state.posts
                                    .filter(post => post.id != newPost.id) 
                const updatePosts = [newPost,...prevPost]
                this.setState({
                    posts: updatePosts
                })
            }
        })
    }


    componentWillUnmount(){

        this.createPostListener.subscribe()
    }
 
    getPosts= async()=>{

        const result = await API.graphql(graphqlOperation(listPosts))

        this.setState({posts: result.data.listPosts.items})
    //    console.table(result.data.listPosts.items)
       // console.log(result.data.listPosts.items)
    //    console.log(result)
    }

    render(){
        const rowStyle= {
                background:'#f4f4f4',
                padding: '10px',
                border:' 1py #ccc dotted',
                margin: '14px'


        }
        const {posts}= this.state
        posts.sort((y,x) =>{return (y.createdAt>x.createdAt?'-1':'1')})
        
    
    //   console.table(posts)
        const postsList = posts.map((post, index) =>{
            return <div key={index} className="posts" style={rowStyle} >
            <h3> {post.postTitle} </h3>
            <h4> { post.postBody }</h4>
            <span> { post.postOwnerUsername}</span>
            <time style={{fontStyle:"italic", color:'#0ca5e297'}} >
                {new Date(post.createdAt).toDateString()}
            </time>
              <EditPost/>
              <DeletePost data={post}/>
            </div>


        })
       
        
        //.reverse()
   
        return (
          <div>
              {postsList}
          </div>
        )
        
    }
}
