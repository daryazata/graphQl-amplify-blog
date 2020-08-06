import React, { Component } from 'react';
import {listPosts} from '../graphql/queries'
import {API, graphqlOperation} from 'aws-amplify'
import DeletePost from './DeletePosts'
import EditPost from './EditPost'
import '../App.css'
import { onCreatePost, onDeletePost, onUpdatePost } from '../graphql/subscriptions';

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

        this.DeletePostLister = API.graphql(graphqlOperation(onDeletePost))
            .subscribe({
                next: postData=>{

                    const deletedPost = postData.value.data.onDeletePost
                    const updatedPosts = this.state.posts.filter(post => post.id != deletedPost.id) 
                   
                    this.setState({
                        posts: updatedPosts

                    })
                }
            })
       this.updatePostListener = API.graphql(graphqlOperation(onUpdatePost))    
            .subscribe({
          //      Event | Description next| Triggered every time a message is successfully received for the topic 
                next: postData => { 
                     const posts = [...this.state.posts]
                    // getting the updated post data
                    const updatePost = postData.value.data.onUpdatePost

                    const updatedPostS=[]
                    posts.map(post =>{
                        if(post.id== updatePost.id){
                            post = {...updatePost}
                            console.log(post)
                        }
                        updatedPostS.push(post)
                        return updatedPostS
                    })

                    this.setState({
                        posts: updatedPostS
                    }
                   // , ()=>console.table(this.state.posts)
                    )        
                }
            })
    }


    componentWillUnmount(){

        this.createPostListener.unsubscribe()
        this.deletePostListener.unsubscribe()
        this.updatePostListener.unsubscribe()
    }
 
    getPosts= async()=>{

        const result = await API.graphql(graphqlOperation(listPosts))

        this.setState({posts: result.data.listPosts.items})
    //    console.table(result.data.listPosts.items)

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
            <time style={{fontStyle:"italic", color:'#0ca5e297'}} >
                {new Date(post.updatedAt).toDateString()}
            </time>

            {delete post['comments']}
            {delete post['likes']}
            {delete post['updatedAt']}


              <EditPost {...post}/>
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
