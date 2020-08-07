let result= posts.map(post =>{
    if(post.id == postId){
        if(post.postOwnerId== this.state.ownerId) return true
        post.likes.items.map(like =>{
            if(like.likeOwnerId == this.state.ownerId) return true
        })

        return false
    }

})

console.log('result',result)


/*         let post = posts.filter(post =>
    post.id == postId
) 
.filter(post=> post.postOwnerId == this.state.ownerId)
.map(post => 
    post.likes.items.map( like => like.likeOwnerId== this.state.ownerId?true:false)     
 )
 console.log('post:',post)
if(post.length>0) console.log('true post')
return post */