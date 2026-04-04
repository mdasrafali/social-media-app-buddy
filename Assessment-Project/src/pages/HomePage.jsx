import Feed from "../components/feed/Feed";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import MobileMenu from "../components/layout/MobileMenu";
import NavBar from "../components/layout/NavBar";
import LeftSideBar from "../components/sidebarLeft/LeftSideBar";
import RightSiderBar from "../components/sidebarRight/RightSiderBar";
import ThemeSwitcher from "../components/layout/ThemeSwitcher";

export default function HomePage() {
  return (
    <>
      <div className="_layout _layout_main_wrapper">
        {/* <!--Switching Btn Start--> */}
        <ThemeSwitcher />
        {/* <!--Switching Btn End--> */}
        <div className="_main_layout">
          {/* <!--Desktop Menu Start--> */}
          <NavBar />
          {/* <!--Desktop Menu End-->
      <!--Mobile Menu Start--> */}
          <MobileMenu />
          {/* <!--Mobile Menu End-->
      <!-- Mobile Bottom Navigation --> */}
          <MobileBottomNav />
          {/* <!-- Mobile Bottom Navigation End -->
      <!-- Main Layout Structure --> */}
          <div className="container _custom_container">
            <div className="_layout_inner_wrap">
              <div className="row">
                {/* <!-- Left Sidebar --> */}
                <LeftSideBar />
                {/* <!-- Left Sidebar -->
            <!-- Layout Middle --> */}
                <Feed />
                {/* <!-- Layout Middle -->
            <!-- Right Sidebar --> */}
                <RightSiderBar />
              </div>
              {/* <!-- Right Sidebar --> */}
            </div>
          </div>
        </div>
        {/* <!-- Main Layout Structure --> */}
      </div>
    </>
  );
}
