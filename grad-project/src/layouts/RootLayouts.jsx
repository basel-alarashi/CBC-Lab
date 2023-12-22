import { useState, useEffect, Fragment } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { loginSuccess } from "../recoil/atoms";
import { useRecoilState } from "recoil";
import api from "../api/posts";

function RootLayouts() {
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function check(){
      const response = await api.get("check/");
      setSuccess(response.data);
    }
    check();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get("logout/");
      console.log("logged out");
      setSuccess(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="">
      <header>
        <nav className="bg-main py-4 page-container text-xl">
          <div>
            <div className="flex justify-between items-center ">
              <div className="hidden md:block">
                <div className="flex items-center ml-10">
                  {success? (
                    <Fragment>
                      <NavLink
                        to="/"
                        className="text-sec hover:text-main hover:bg-white block px-3 py-2 rounded-md font-bold bg-transparent max-w-fit min-w-100 outline outline-white "
                        onClick={handleLogout}
                      >
                        تسجيل الخروج
                      </NavLink>
                      <NavLink
                        to="/patients"
                        className="text-white hover:text-gray-300 px-3 py-2 rounded-md font-medium"
                      >
                        جميع المرضى
                      </NavLink>
                      <NavLink
                        to="/create"
                        className="text-white hover:text-gray-300 px-3 py-2 rounded-md font-medium"
                      >
                        إضافة مريض
                      </NavLink>
                    </Fragment>
                  ): (
                    <Fragment>
                      <NavLink
                        to="/register"
                        className=" text-main hover:text-white outline outline-white hover:bg-main block px-3 py-2 rounded-md font-bold bg-white ml-5"
                      >
                        إنشاء حساب
                      </NavLink>
                      <NavLink
                        to="/login"
                        className="text-white hover:text-main hover:bg-white block px-3 py-2 rounded-md font-bold bg-transparent max-w-fit min-w-100 outline outline-white "
                      >
                        تسجيل الدخول
                      </NavLink>
                    </Fragment>
                  )}
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button
                  type="button"
                  className="text-gray-500 hover:text-white "
                  aria-label="Menu"
                  onClick={toggleMenu}
                >
                  <svg
                    className="h-8 w-8 text-sec"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center ">
                <NavLink
                  to="/"
                  className="flex items-center  w-14 h-14 text-white"
                >
                  <img
                    src="media/images/logo.svg"
                    alt="logo"
                    className="text-teal-500 fill-current mr-2"
                  />
                </NavLink>
              </div>
            </div>
          </div>

          <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
            <div className="px-2 pt-2 pb-2 ">
              <NavLink
                to="/"
                className="text-white hover:text-gray-300 block px-3 py-2 rounded-md font-medium"
                onClick={toggleMenu}
              >
                الصفحة الرئيسية
              </NavLink>
              {success? (
                <Fragment>
                  <NavLink
                      to="/"
                      className="text-white hover:text-gray-300 block px-3 py-2 rounded-md font-medium"
                      onClick={handleLogout}
                    >
                      تسجيل الخروج
                    </NavLink>
                  <NavLink
                    to="/create"
                    className="text-white hover:text-gray-300 block px-3 py-2 rounded-md font-medium"
                    onClick={toggleMenu}
                  >
                    إضافة مريض
                  </NavLink>
                  <NavLink
                    to="/patients"
                    className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-basefont-medium"
                    onClick={toggleMenu}
                  >
                    جميع المرضى
                  </NavLink>
                </Fragment>
              ): (
                <Fragment>
                  <NavLink
                    to="/register"
                    className="text-white hover:text-white block px-3 py-2 rounded-md font-medium"
                  >
                    إنشاء حساب
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="text-white hover:text-white block px-3 py-2 rounded-md font-medium"
                  >
                    تسجيل الدخول
                  </NavLink>
                </Fragment>
              )}
            </div>
          </div>
        </nav>
      </header>
      <main onClick={isOpen ? toggleMenu : undefined}>
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayouts;
