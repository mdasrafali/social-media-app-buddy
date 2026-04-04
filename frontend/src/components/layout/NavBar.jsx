import Profile from "../profile/Profile";
import NavActions from "./NavActions";
import NavElements from "./NavElements";
import SearchBar from "./SearchBar";

export default function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
        <div className="container _custom_container">
          <NavActions />
          <div className=" navbar-collapse" id="navbarSupportedContent">
            <SearchBar />

            <NavElements />

            <Profile />
          </div>
        </div>
      </nav>
    </>
  );
}
