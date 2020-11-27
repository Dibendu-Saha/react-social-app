import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import Loader from "./Loader";

function ProfilePosts() {
    const { username } = useParams();
    const [isloading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        const thisRequest = Axios.CancelToken.source();

        async function getPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: thisRequest.token });
                setPosts(response.data);
                setIsLoading(false);
            }
            catch (ex) {
                console.log(`Error: ${ex}`);
            }
        }
        getPosts();

        // Clean-up
        return () => {
            thisRequest.cancel();
        }
    }, [username]);

    if (isloading)
        return <Loader />

    return (
        <div className="list-group">
            {
                posts.map((post) => {
                    const date = new Date(post.createdDate)
                    const formattedDate = `${date.getDay() + 1}-${months[date.getMonth()]}-${date.getFullYear()}`

                    return (
                        <Link to={`/post/${post._id}`} key={post._id} className="list-group-item list-group-item-action">
                            <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>{post.title}</strong>
                            <span className="text-muted small"> on {formattedDate} </span>
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default ProfilePosts