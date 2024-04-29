import { baseApiUrl } from "../constants.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [lastPage, setLastPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletes, setDeletes] = useState(0);

  useEffect(() => {
    fetch(`${baseApiUrl}/posts?page=${currentPage}`)
      .then((res) => {
        // recupera i dati della paginazione dagli header
        setLastPage(parseInt(res.headers.get("X-WP-TotalPages")));
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setPosts(data);
      });
  }, [currentPage]);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  function generatePaginationArray() {
    let paginationArr = [];
    for (let index = 1; index <= lastPage; index++) {
      paginationArr.push({
        n: index,
        active: currentPage === index,
      });
    }
    return paginationArr;
  }

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
          // Forza l'aggiornamento del componente
          setDeletes(deletes + 1);
        }
      })
      .catch((error) => {
        console.error("Errore durante l'eliminazione del post:", error);
      });
  };

  return (
    <div className="container">
      <h1 className="mt-5 ms-4">Il Blog degli appassionati di tecnologia</h1>
      <ul className="mt-4">
        {posts.map((post) => (
          <li className="list-group lh-lg" key={post.id}>
            <div className="row align-items-center">
              <div className="col">
                <Link to={`/posts/${post.id}`}>{post.title.rendered}</Link>
              </div>
              <div className="col">
                <button className="btn btn-danger btn-sm" onClick={() => deletePost(post.id)}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <nav className="mx-4 mt-5">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 && "disabled"}`}>
            <span className="page-link" onClick={() => currentPage !== 1 && changePage(currentPage - 1)}>
              Previous
            </span>
          </li>

          {generatePaginationArray().map((page) => (
            <li key={page.n} className={`page-item ${page.active && "active"}`}>
              <span className="page-link" onClick={() => changePage(page.n)}>
                {page.n}
              </span>
            </li>
          ))}

          <li className={`page-item ${currentPage === "lastPage" && "disabled"}`}>
            <span className="page-link" onClick={() => currentPage !== lastPage && changePage(currentPage + 1)}>
              Next
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
