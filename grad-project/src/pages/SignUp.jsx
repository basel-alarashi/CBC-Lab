import { useEffect, useRef, useState } from "react";
import "../styles/signup.css";
import api from '../api/posts'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginSuccess } from "../recoil/atoms";
import RootLayouts from "../layouts/RootLayouts";

function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    matchPassword: "",
  });

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matchPassword, setMatchpassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [success, setSuccess] = useRecoilState(loginSuccess);
  const userRef = useRef();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const isEmailValid = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(form.email);
  };

  const ispasswordValid = () => {
    const passwordRegex = /.{4,}$/;
    return passwordRegex.test(form.password) && form.password === form.matchPassword;
  };

  // for validation form
  const isFormValid = () => {
    return isEmailValid() && ispasswordValid();
  };

  // this is a library to make a beautiful pop-up
  const notifySuccess = () => toast.success("تم إنشاء الحساب بنجاح");
  const notifyFailed = () =>
    toast.error(
      "الرجاء التأكد من كلمة المرور، ويجب أن يكون طول الكلمة 4 محارف على اﻷقل"
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await api.post(
      "register/",
      JSON.stringify({
        username: form.username,
        email: form.email,
        password: form.password
      }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    if (response.status === 201){
      console.log(response);
      navigate('/login');
    }
  };

  return (
    <>
      <RootLayouts />
      <form action="" onSubmit={handleSubmit}>
        <div className="signup-container my-10">
          <img
            src="media/images/logo.svg"
            alt="SIGNUP logo"
            className="logo m-auto w-20 h-20"
          />
          <h3>إنشاء حساب جديد </h3>
          <input
            type="text"
            name="name"
            required
            value={form.username}
            placeholder="الاسم"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            ref={userRef}
          />
          <input
            type="email"
            name="email"
            required
            value={form.email}
            placeholder="البريد الالكتروني"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            name="password"
            required
            value={form.password}
            placeholder="كلمة المرور"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="password"
            name="matchPassword"
            required
            value={form.matchPassword}
            placeholder="تأكيد كلمة المرور"
            onChange={(e) => setForm({ ...form, matchPassword: e.target.value })}
          />
          <button
            type="submit"
          >
            إنشاء حساب
          </button>
          <div className="to-signup flex justify-end">
            <p> لديك حساب؟ </p>
            <Link to="/login"> تسجيل دخول </Link>
          </div>
          <ToastContainer />
        </div>
      </form>
    </>
  );
}

export default SignUp;
