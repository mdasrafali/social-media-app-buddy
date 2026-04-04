import Logo from "../../assets/images/logo.svg"

export default function NavActions() {
  return (
    <>
      <div className="_logo_wrap">
        <a className="navbar-brand" href="feed.html">
          <img src={Logo} alt="Image" className="_nav_logo" />
        </a>
      </div>
      <button
        className="navbar-toggler bg-light"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        {" "}
        <span className="navbar-toggler-icon"></span>
      </button>
    </>
  );
}
