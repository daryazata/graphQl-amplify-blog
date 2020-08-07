import React, { Component } from 'react';
import {listPosts} from '../graphql/queries'
import {API, graphqlOperation, Auth} from 'aws-amplify'
import DeletePost from './DeletePosts'
import EditPost from './EditPost'
import '../App.css'
import { onCreatePost, onDeletePost, onUpdatePost, onCreateComment, onCreateLike } from '../graphql/subscriptions';
import CreateCommentPost from './CreateCommentPost'
import CommentPost from './CommentPost';
import { FaThumbsUp, FaSadTear } from 'react-icons/fa';
import { createLike } from '../graphql/mutations';
import UsersWhoLikedPost from './UsersWhoLikedPost'


export default class DisplayPosts extends Component{


    state = {

        ownerId:"",
        ownerUsername:"",
        errorMessage:"",
        postLikedBy: [],

        isHovering:false,
      
        posts: []
    }

    componentDidMount = async ()=>{
        this.getPosts()

        //authentication
        await Auth.currentUserInfo()
        .then(user=>{
            console.log("user name", user.username)
            console.log("user attrib", user.attributes.sub)
           
            this.setState({
                ownerId : user.attributes.sub,
                ownerUsername : user.username
            })
        })

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
                }
                )
            }
        })

        this.deletePostLister = API.graphql(graphqlOperation(onDeletePost))
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
                        if(post.id == updatePost.id){
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


            this.createPostCommentListener = API.graphql(graphqlOperation(onCreateComment))    
            .subscribe({
          //      Event | Description next| Triggered every time a message is successfully received for the topic 
                next: commentData => {
                    const createdComment = commentData.value.data.onCreateComment
                  //  console.log(createdComment)
                    let posts = [...this.state.posts]
                    posts.map(post=> {
                        if(createdComment.post.id == post.id){
                       
                            post.comments.items.push(createdComment)
                          //  console.log(createdComment.post.comments)
                        }
                    })
                    
                    this.setState({
                        posts
                    }
                   // ,()=> console.log(posts)
                    )
                   
                 }})

            this.createPostLikeListener = API.graphql(graphqlOperation(onCreateLike ))
                 .subscribe({

                    next:postData =>{
                        const createLike = postData.value.data.onCreateLike

                        let posts = [...this.state.posts]
                        posts.map(post =>{
                            if(post.id == createLike.post.id){
                                post.likes.items.push(createLike)
                            }
                        })

                        this.setState({
                            posts
                        })


                    }
                 })
    }



    componentWillUnmount(){

        this.createPostListener.unsubscribe()
        this.deletePostListener.unsubscribe()
        this.updatePostListener.unsubscribe()
        this.createPostCommentListener.unsubscribe()
        this.createPostLikeListener.unsubscribe()
    }
 
    getPosts= async()=>{

        const result = await API.graphql(graphqlOperation(listPosts))

        this.setState({posts: result.data.listPosts.items}
            ,()=> console.log(this.state.posts)
            
            )
        console.log(result.data.listPosts.items)

    }

    likedPost = (postId)=>{

        let posts = [...this.state.posts]

        for (let post of posts){
            if(post.id == postId){
                if(post.postOwnerId == this.state.ownerId) return true
                for(let like of post.likes.items){
                    if(like.likeOwnerId== this.state.ownerId )return true
                }
            }
        }
        return false
       
    }
    handleMouseHover = async postId =>{

        this.setState({isHovering:!this.state.isHovering})

        let innerLikes = this.state.postLikedBy

        let posts = [...this.state.posts]
        posts.map(post =>{
            if(post.id==postId)
            post.likes.items.map(like =>{
              innerLikes.push(like.likeOwnerUsername)
            })
        })

        this.setState({
            postLikedBy:innerLikes
        })
      //  console.log(innerLikes)
   

    }

    handleMouseLeave = async => {
        this.setState({isHovering:false})
        this.setState({ postLikedBy:[]})
    }
    handleLike = async postId =>{

        if(this.likedPost(postId))
        {
            return this.setState({errorMessage: "cant like your own post"}) 
        }else{

            const input =
            {
                numberLikes: 1,
                likeOwnerId: this.state.ownerId,
                likeOwnerUsername: this.state.ownerUsername,
                likePostId: postId
            }
            try{
               const result=  await API.graphql(graphqlOperation(createLike, {input}))
                console.log("liked", result.data)
            }catch(e){
                console.log(e)
            }
        }
    }

    render(){
        let likedBy = [...this.state.postLikedBy]
        console.log('liked length',likedBy.length)
        console.log('statehover',this.state.isHovering)
       
        
        const rowStyle= {
                background:'#f4f4f4',
                padding: '10px',
                border:' 1py #ccc dotted',
                margin: '14px'


        }
        let loggedInUser= this.state.ownerId
        let {posts}= {...this.state}
        posts = [...posts]
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
      
 
            {post.postOwnerId == loggedInUser &&
            
              <EditPost {...post}/>
            }
              {post.postOwnerId == loggedInUser &&
            
              <DeletePost data={post}/>
            }
              <span>
                  <p className="alert"> {post.postOwnerId ==loggedInUser && this.state.errorMessage}</p>
                 <p onMouseEnter ={()=>this.handleMouseHover(post.id)}
                    onMouseLeave ={ ()=>this.handleMouseLeave()}
                  onClick ={()=>{this.handleLike(post.id)}}
                  className="like-button"
                  style={{color: (post.likes.items.length >0)? "purple": "gray"}}
                  >
                  
                   <FaThumbsUp /> 
                    {post.likes.items.length}</p>

                    {
                        this.state.isHovering &&
                        <div className="users-liked">
                            {
                                likedBy.length== 0 ? `liked by no one yet` :'liked by'
                            
                            }
                            {
                                   likedBy.length== 0 ? <FaSadTear />: <UsersWhoLikedPost data={likedBy}/>
                            }
                        </div>
                    }
              </span>

              <span>
                  <CreateCommentPost postId={post.id}/>
                  {post.comments.items.length > 0 && 
                <span style= {{fontSize:"19px", color:"gray"}}>
                    Comments:
                </span>}
                {
                    post.comments.items.map((comment, index)=>(<CommentPost key= {index} commentData={comment}/>)
                    )
                }
              </span>
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
