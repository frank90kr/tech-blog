import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseApiUrl } from "../constants.js";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [lastPage, setLastPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${baseApiUrl}/posts?page=${currentPage}&_embed=1`)
      .then((res) => {
        setLastPage(parseInt(res.headers.get("X-WP-TotalPages")));
        return res.json();
      })
      .then((data) => {
        setPosts(data);
      });
  }, [currentPage]);

  useEffect(() => {
    const filteredPosts = posts.filter((post) => post.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(filteredPosts);
  }, [searchTerm, posts]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const deletePost = (postId) => {
    setLoading(true);

    const authString = btoa("frank:WxYe utDe vOtm aIRs QQYt L1fX");
    fetch(`${baseApiUrl}/posts/${postId}`, {
      headers: {
        Authorization: `Basic ${authString}`,
      },
      method: "DELETE",
    })
      .then((res) => {
        setLoading(false);

        if (res.ok) {
          setPosts(posts.filter((post) => post.id !== postId));
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Errore durante l'eliminazione del post:", error);
      });
  };

  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-9">
          <h1 className="text-center mt-3">Il Blog degli appassionati di tecnologia</h1>

          <div id="carouselExampleCaptions" className="carousel slide">
            <div className="carousel-indicators">
              {posts.map((post, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                  aria-current={index === 0 ? "true" : "false"}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>
            <div className="carousel-inner">
              {posts.map((post, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <img
                    className="d-block w-100"
                    src={
                      post._embedded && post._embedded["wp:featuredmedia"]
                        ? post._embedded["wp:featuredmedia"][0].source_url
                        : "/assets/1155130.jpg"
                    }
                    alt="immagine non disponibile"
                  />
                  <div className="carousel-caption d-none d-md-block text-white bg-black opacity-75 p-3">
                    <h5 className="">{post.title.rendered}</h5>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          <form className="d-flex mx-auto w-50 mt-4" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={handleChange}
            />
          </form>
          <Link to="/create" className="btn btn-secondary ms-4 fw-semibold px-3">
            + New Post
          </Link>
          <ul className="mt-4">
            {(searchResults.length > 0 ? searchResults : posts).map((post) => (
              <li className="list-group lh-md" key={post.id}>
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <img
                      className="w-100"
                      src={
                        post._embedded["wp:featuredmedia"]
                          ? post._embedded["wp:featuredmedia"][0].source_url
                          : "/assets/1155130.jpg"
                      }
                      alt="immagine non disponibile"
                    />
                  </div>
                  <div className="col-md-9">
                    <Link className="text-dark fs-5 titolo-post" to={`/posts/${post.id}`}>
                      {post.title.rendered}
                    </Link>

                    <div className="d-flex">
                      {loading ? (
                        <div className="spinner-border text-danger me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <>
                          <button className="btn btn-danger btn-sm mb-2 px-3" onClick={() => deletePost(post.id)}>
                            Delete
                          </button>
                          <Link to={`/edit/${post.id}`} className="btn btn-secondary btn-sm px-4 mb-2 ms-2">
                            Edit
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                  <hr />
                </div>
              </li>
            ))}
          </ul>

          <nav className="mx-4 mt-5 pagination-home">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                <span className="page-link" onClick={() => currentPage !== 1 && changePage(currentPage - 1)}>
                  Previous
                </span>
              </li>

              {[...Array(lastPage).keys()].map((page) => (
                <li key={page + 1} className={`page-item ${currentPage === page + 1 && "active"}`}>
                  <span className="page-link" onClick={() => changePage(page + 1)}>
                    {page + 1}
                  </span>
                </li>
              ))}

              <li className={`page-item ${currentPage === lastPage && "disabled"}`}>
                <span className="page-link" onClick={() => currentPage !== lastPage && changePage(currentPage + 1)}>
                  Next
                </span>
              </li>
            </ul>
          </nav>
        </div>
        <div className="col-md-3 mt-2 lh-lg">
          <div className="sidebar">
            <h3 className="text-center mt-4">News</h3>
            <ul className="me-2">
              {posts.slice(0, 6).map((post) => (
                <li className="segnaposto" key={post.id}>
                  <Link className="text-dark titolo-post" to={`/posts/${post.id}`}>
                    {post.title.rendered}
                  </Link>
                  <h6 className="text-secondary opacity-75 mt-2">{new Date(post.date).toLocaleString()}</h6>
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
