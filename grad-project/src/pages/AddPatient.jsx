import "../styles/addPatient.css";
import MyDropzone from "../layouts/MyDropzone";
import { useRecoilState, useRecoilValue } from "recoil";
import { addPationtForm, addPationtImg, base64Image } from "../recoil/atoms";
import { useState } from "react";
import Modal from "./Modal";
import api from "../api/posts";
import RootLayouts from "../layouts/RootLayouts";

export default function AddPatient() {
  const [openModal, setOpenModal] = useState(false);
  const [files, setFiles] = useRecoilState(addPationtImg);
  const [form, setForm] = useRecoilState(addPationtForm);

  const [result, setResult] = useState({
    rbcs: 0,
    wbcs: 0,
    platelets: 0,
    hgb: 0,
    hct: 0,
    mvc: 0,
    mhc: 0,
    mchc: 0,
    rdw: 0,
    patient_id: 0,
  });

  let response = {};

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

  const baseImage = useRecoilValue(base64Image);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length > 0) {
      setOpenModal(true);
    }
    try {
      // console.log(baseImage);
      // setForm({ ...form, images: baseImage });
      response = await api.post(
        "create/",
        JSON.stringify({
          patient_name: form.patient_name,
          age: form.age,
          sexuality: form.sexuality,
          images: baseImage,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        }
      );
      const id = response.data.id;
      setTimeout(async() => {
        console.log('delay')
        try {
        const res = await api.get(`result/${id}/`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        });
        setResult(res.data);
      } catch (err) {
        console.log(err);
      }
    }, 1000);
    } catch (error) {
      console.log(error);
    }

    // console.log(form);
    // console.log(baseImage);
  };

  return (
    <>
      <RootLayouts />
      <div className="text-2xl mx-52 ">
        <section>
          <h2 className="text-center text-4xl text-sec bg-main rounded-t-lg p-2 mt-12">
            إضافة مريض
          </h2>
          <form
            className="border p-10 rounded-b-lg grid bg-white mb-20"
            onSubmit={handleSubmit}
          >
            <div className="name flex mb-10">
              <label htmlFor="name" className="ml-12 ">
                الاسم
              </label>
              <input
                type="text"
                id="patient_name"
                placeholder="الرجاء كتابة الاسم كاملاً "
                required
                className="bg-gray-200 ml-5 p-2 rounded-md text-main"
                // value={files.patient_name}
                onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
              />
            </div>
            <div className="name flex mb-10">
              <label htmlFor="age" className="ml-12 ">
                العمر
              </label>
              <input
                type="number"
                id="age"
                placeholder="الرجاء كتابة رقم"
                required
                className="bg-gray-200 ml-5 p-2 rounded-md text-main"
                // value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>
            <div className="name flex mb-10">
              <div className="ml-12 ">الجنس</div>
              <label className="ml-10">
                <input
                  type="radio"
                  name="gender"
                  required
                  value="male"
                  onChange={(e) => setForm({ ...form, sexuality: e.target.value })}
                />
                ذكر
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  required
                  onChange={(e) => setForm({ ...form, sexuality: e.target.value })}
                />
                أنثى
              </label>
            </div>
            <div className="upload-img ">
              <p className="text-center text-main font-bold p-2">
                الرجاء رفع صورة أو عدة صور
              </p>
              <MyDropzone
                className="p-16 mt-2 border border-neutral-200 border-sec-color"
              />
            </div>
            <button
              type="submit"
              className="bg-main text-white rounded-md px-5 py-3 m-auto hover:bg-red-500"
            >
              إرسال
            </button>
          </form>
        </section>
        <Modal
          open={openModal}
          setOpen={setOpenModal}
          result={result}
          response={response}
        />
      </div>
    </>
  );
}
