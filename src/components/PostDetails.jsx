import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseApiUrl } from "../constants";

const PostDetails = () => {
  const [post, setPost] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    fetch(`${baseApiUrl}/posts/${id}?_embed=1`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
      })
      .catch((error) => {
        console.error("Errore nella richiesta del post:", error);
      });
  }, [id]);

  return (
    post && (
      <div className="container">
        <h1 className="mx-5 mt-4">{post.title.rendered}</h1>
        <h5 className="text-secondary mx-5">Author: {post._embedded.author[0].name}</h5>
        {post.date && (
          <h6 className="text-secondary mx-5">Data di creazione: {new Date(post.date).toLocaleString()}</h6>
        )}
        {post._embedded && post._embedded["wp:term"] && (
          <div className="mx-5">
            Categoria:
            {post._embedded["wp:term"][0].map((category) => (
              <span key={category.id} className="badge rounded-pill text-bg-secondary ms-2 px-3">
                {category.name}
              </span>
            ))}
          </div>
        )}

        <div className="row">
          <div className="col-8 mt-3 mx-5">
            <div dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
          </div>
        </div>
      </div>
    )
  );
};

export default PostDetails;
