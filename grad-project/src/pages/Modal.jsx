import "../styles/modal.css";
import api from "../api/posts";
import {useState} from 'react'
import PropagateLoader from "react-spinners/PropagateLoader";

function Modal({ open, setOpen, result, response }) {
  if (!open) return null;
  let [loading, setLoading] = useState(true);

const handleSubmit = () => {
  setOpen(false);
};

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  let rdw_ref = "11.8 - 15.6";
  let mchc_ref = "33 - 36";
  let mch_ref = "27 - 32";
  let mcv_ref = "80 - 100";
  let platelets_ref = "1.5 - 4.5";
  let hct_ref = "36 - 44";
  let hgb_ref = "11.3 - 14.1";
  let rbc_ref = "4.2 - 5.3";
  let wbc_ref = "6.2 - 17";

  if (response.age < 12) {
    hct_ref = "36 - 44";
    if (response.age < 2) {
      hgb_ref = "11.3 - 14.1";
      rbc_ref = "4.2 - 5.3";
      wbc_ref = "6.2 - 17";
    } else {
      wbc_ref = "4.5 - 11";
      if (response.age < 6) {
        rbc_ref = "4.2 - 5";
        hgb_ref = "10.9 - 15";
      } else {
        rbc_ref = "4.3 - 5.1";
        hgb_ref = "11.9 - 15";
      }
    }
  } else {
    wbc_ref = "4.5 - 11";
    if (response.sex === "male") {
      hct_ref = "38.8 - 50";
      rbc_ref = "4.7 - 6.1";
      hgb_ref = "13 - 18";
    } else {
      hct_ref = "34.9 - 44.5";
      rbc_ref = "4 - 5";
      hgb_ref = "12 - 16";
    }
  }

  return (
    <div className="overlay page-container">
      <div className="bg-white w-full h-[95%] my-auto text-center rounded">
{loading ? (
          <div className="sweet-loading flex justify-center items-center h-screen ">
            <PropagateLoader
              color="#a5001a"
              loading={loading}
              // cssOverride={override}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
              className="bg-red-500"
              speedMultiplier="0.8"
            />
          </div>
        ) : (
        <div>
                  <h2 className="text-main text-4xl my-3">نتيجة التحليل</h2>
        <table className="min-w-[80%] m-auto bg-white border" dir="ltr">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                Test
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                Result
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                Reference
              </th>
            </tr>
          </thead>
          <tbody className="p-10">
            <tr>
              <td className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                RBCs(x10⁶/μl)
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {result.rbcs}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{rbc_ref}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                WBCs(x10³/μl)
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {result.wbcs}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{wbc_ref}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                Platelets(x10⁵/μl)
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {result.platelets}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{platelets_ref}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                HGB(g/dl)
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {result.hgb}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{hgb_ref}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                HCT(%)
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {result.hct}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{hct_ref}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                MCV(fl)
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {result.mcv}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{mcv_ref}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                MCH(pg)
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {result.mch}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{mch_ref}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                MCHC(g/dl)
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {result.mchc}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{mchc_ref}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200 bg-main text-white">
                RDW(%)
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {result.rdw}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {rdw_ref}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="buttons my-3 mx-auto ">
          <a
            className="bg-main p-3 ml-20 rounded-md text-sec hover:bg-red-500 hover:text-white"
            href={`http://127.0.0.1:8000/api/download/${result.patient}/`}
          >
            تحميل الملف
          </a>
          <button
            className="bg-sec p-3 rounded-md hover:bg-gray-500 hover:text-white"
            onClick={() => setOpen(false)}
          >
            إلغاء
          </button>
        </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
