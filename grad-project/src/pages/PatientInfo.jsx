import { useNavigate, useParams } from "react-router-dom";
import api from "../api/posts";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { addPationtForm, base64Image } from "../recoil/atoms";
import { XMarkIcon } from "@heroicons/react/24/solid";
import MYDropzoneServer from "../layouts/MyDropzoneServer";
import RootLayouts from "../layouts/RootLayouts";

export default function PatientInfo() {
  const { id } = useParams();
  // const [data, setData] = useRecoilState(addPationtForm);
  const [data, setData] = useState({});
  const [images, setImages] = useRecoilState(base64Image);

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const csrftoken = getCookie("csrftoken");

  const navigate = useNavigate();
  // fetch the data from API
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`patients/${id}/`, {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        });
        setData(res.data);
        // console.log(res.data);
        // call a function that make a req to run the model on the backEnd
      } catch (error) {
        // here we don't get response at all
        console.log("Error:", error);
      }
    };
    fetchInfo();
  }, []);

  const removeFile = (name) => {
    setImages((images) => images.filter((file) => file !== name));
  };

  const handleSexChange = (e) => {
    setData({ ...data, sexuality: e.target.value });
  };

  const handleInfoChange = (e) => {
    if (e.target.id === "name") {
      setData({ ...data, patient_name: e.target.value });
    } else {
      setData({ ...data, age: parseInt(e.target.value) });
    }
  };

  const deleteUser = async (e) => {
    try {
      await api.delete(`delete/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        withCredentials: true,
      });
      navigate("/patients");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      console.log(data);
      console.log(images);
      setData(() => ({
        ...data,
        images: images.map((e) => e)
      }));
      console.log(data);
      const res = await api.put(`update/${id}/`, data, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        withCredentials: true,
      });
      navigate("/patients");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <RootLayouts />
      <div className="mx-10 ">
        <h2 className="text-center text-4xl text-sec bg-main rounded-t-lg py-3 px-10 mt-12">
          التعديل على معلومات المريض
        </h2>
        <form className="border p-10 rounded-b-lg grid bg-white">
          <div className="name flex mb-10 text-2xl ">
            <label htmlFor="name" className="ml-12 ">
              الاسم
            </label>
            <input
              type="text"
              id="name"
              placeholder="الرجاء كتابة الاسم كاملاً "
              required
              className="bg-gray-200 ml-5 p-2 rounded-md text-main outline-main"
              defaultValue={data.patient_name}
              onChange={handleInfoChange}
            />
          </div>
          <div className="name flex mb-10 text-2xl">
            <label htmlFor="age" className="ml-12 ">
              العمر
            </label>
            <input
              type="number"
              id="age"
              placeholder="الرجاء كتابة رقم"
              required
              className="bg-gray-200 ml-5 p-2 rounded-md text-main outline-main"
              defaultValue={data.age}
              onChange={handleInfoChange}
            />
          </div>
          <div className="sex flex mb-10 text-2xl">
            <div className="ml-12 ">الجنس</div>
            <label className="ml-10">
              <input
                type="radio"
                name="gender"
                required
                className=""
                value="male"
                checked={data.sexuality === "male"}
                onChange={handleSexChange}
              />
              ذكر
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                required
                className=""
                checked={data.sexuality === "female"}
                onChange={handleSexChange}
              />
              أنثى
            </label>
          </div>
          <div className="images border mb-10 px-5">
            <h3 className=" text-center w-fit m-auto p-3 rounded-lg text-3xl text-main">
              الصور
            </h3>
            <MYDropzoneServer
              files={data}
              setFiles={setData}
              className="p-16 mt-2 border border-neutral-200 border-sec-color text-2xl"
            />
          </div>
          {/* <img src={data.images[0]} alt="" /> */}
          <div className="buttuns text-center">
            <button
              type="submit"
              className="bg-sec text-main font-bold rounded-md px-5 py-3 m-auto hover:bg-gray-400 ml-5"
              onClick={handleChange}
            >
              تطبيق التعديلات
            </button>
            <button
              type="reset"
              className="bg-red-500 text-white rounded-md px-5 py-3 m-auto hover:bg-main"
              onClick={deleteUser}
            >
              حذف المريض
            </button>
          </div>
        </form>
        <br />
        <br />
        <br />
      </div>
    </>
  );
}
