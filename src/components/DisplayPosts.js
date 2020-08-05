import React, { Component } from 'react';
import {listPosts} from '../graphql/queries'
import {API, graphqlOperation} from 'aws-amplify'

export default class DisplayPosts extends Component{


    state={
       posts: []
    }

    componentDidMount = async ()=>{
        this.getPosts()
    }
    getPosts= async()=>{

        const result = await API.graphql(graphqlOperation(listPosts))
        
        this.setState({posts: result.data.listPosts.items})
        console.log(result.data.listPosts.items)
        console.log(result)
    }

    render(){

        return (
            <div className="App">
                    <h2>Hello display posts</h2>
            </div>
        )
    }
}