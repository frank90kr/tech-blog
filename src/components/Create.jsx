import { useState } from "react";
import { baseApiUrl } from "../constants.js";

const Create = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const authString = btoa("frank:WxYe utDe vOtm aIRs QQYt L1fX");
    fetch(`${baseApiUrl}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        title: title,
        content: description,
        status: "publish",
      }),
    })
      .then((res) => {
        if (res.ok) {
          setSuccessMessage(
            <div className="alert alert-success fs-4" role="alert">
              Il post è stato creato con successo!
            </div>
          );
          setTitle("");
          setDescription("");
        } else {
          console.error("Si è verificato un errore durante la creazione del post.");
        }
      })
      .catch((error) => {
        console.error("Si è verificato un errore:", error);
      })
      .finally(() => {
        setLoading(false); // Settiamo lo stato di caricamento a false una volta completato il caricamento
      });
  };

  return (
    <div className="container">
      <h1 className="mt-5">Crea un nuovo post</h1>
      {loading && ( // Mostrare lo spinner solo se lo stato di caricamento è true
        <div className="spinner-border text-secondary ms-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {!loading && ( // Mostrare il form solo se lo stato di caricamento è false
        <div>
          {successMessage}
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Titolo
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={handleTitleChange}
                required
              />
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
              Crea Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Create;
