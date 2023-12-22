import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import api from "../api/posts";
import AuthContext from "../context/AuthProvider";
import { loginSuccess } from "../recoil/atoms";
import { useRecoilState } from "recoil";
import RootLayouts from "../layouts/RootLayouts";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("login/", JSON.stringify({ email, password: pwd }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      setAuth({ email, pwd });
      setEmail("");
      setPwd("");
      navigate("/");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <>
      <RootLayouts />
      <form onSubmit={handleSubmit}>
          <div className="login-container">
            <img
              src="media/images/logo.svg"
              alt="login logo"
              className="logo m-auto w-20 h-20"
            />
            <h3>قم بتسجيل الدخول إلى حسابك</h3>
            {/* <label htmlFor="email">البريد الالكتروني</label> */}
            <input
              type="email"
              name="email"
              required
              ref={userRef}
              placeholder="البريد الالكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* <label htmlFor="email">كلمة السر </label> */}
            <input
              type="password"
              name="password"
              required
              placeholder="كلمة المرور"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
            <div className="forgot-pass">
              <Link to="/">هل نسيت كلمة المرور</Link>
            </div>
            <button style={{marginRight: '1.5rem'}} type="submit">تسجيل الدخول</button>
            <div className="to-signup flex justify-end">
              <p> لا تملك حساب؟ </p>
              <Link to="/register">إنشاء حساب </Link>
            </div>
          </div>
        </form>
    </>
  );
};

export default Login;
