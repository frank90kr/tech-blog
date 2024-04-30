import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseApiUrl } from "../constants.js";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [lastPage, setLastPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    const authString = btoa("frank:WxYe utDe vOtm aIRs QQYt L1fX");
    fetch(`${baseApiUrl}/posts/${postId}`, {
      headers: {
        Authorization: `Basic ${authString}`,
      },
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setPosts(posts.filter((post) => post.id !== postId));
        }
      })
      .catch((error) => {
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
          <h1 className="text-center mt-3 ms-4">Il Blog degli appassionati di tecnologia</h1>
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
              <li className="list-group lh-lg" key={post.id}>
                <div className="row align-items-center">
                  <div className="col">
                    <Link to={`/posts/${post.id}`}>{post.title.rendered}</Link>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-danger btn-sm me-2 ms-5" onClick={() => deletePost(post.id)}>
                      Delete
                    </button>
                    <Link to={`/edit/${post.id}`} className="btn btn-secondary btn-sm px-3">
                      Edit
                    </Link>
                  </div>
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
                <li key={post.id}>
                  <Link to={`/posts/${post.id}`}>{post.title.rendered}</Link>
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
