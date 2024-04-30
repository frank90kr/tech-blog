import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseApiUrl } from "../constants";

const Edit = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetch(`${baseApiUrl}/posts/${id}?_emded=1`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setTitle(data.title.rendered);
        setDescription(data.content.rendered);
      })
      .catch((error) => {
        console.error("Errore durante il recupero del post:", error);
      });
  }, [id]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const authString = btoa("frank:WxYe utDe vOtm aIRs QQYt L1fX");
    fetch(`${baseApiUrl}/posts/${id}?_embed=1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        title: title,
        content: description,
        // status: "publish",
      }),
    })
      .then((res) => {
        if (res.ok) {
          setSuccessMessage(
            <div className="alert alert-success fs-4" role="alert">
              Il post è stato modificato con successo!
            </div>
          );
        } else {
          console.error("Si è verificato un errore durante la modifica del post.");
        }
      })
      .catch((error) => {
        console.error("Si è verificato un errore:", error);
      });
  };

  if (!post) {
    return (
      <div class="spinner-border text-secondary ms-5" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="mt-5">Edit Post</h1>
      {successMessage}
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input type="text" className="form-control" id="title" value={title} onChange={handleTitleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Contenuto
          </label>
          <textarea
            className="form-control"
            id="description"
            rows="5"
            value={description}
            onChange={handleDescriptionChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-secondary w-25">
          Modifica
        </button>
      </form>
    </div>
  );
};

export default Edit;
