import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { patientsTable } from "../recoil/atoms";
import { NavLink, Outlet } from "react-router-dom";
import api from "../api/posts";
import RootLayouts from "../layouts/RootLayouts";

function AllPationts() {
  const [data, setData] = useRecoilState(patientsTable);
  // console.log(data);

  // fetch the data from API
  useEffect(() => {
    const fetchTable = async () => {
      try {
        const res = await api.get("patients/");
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTable();
  }, []);

  // Use the useTable Hook to send the columns and data to build the table
  return (
    <>
      <RootLayouts />
      <div className="bg-gray-200 shadow-md rounded py-10 page-container">
        <table className="bg-white text-center m-auto w-[600px] border ">
          <thead>
            <tr>
              <th className="text-center py-4 px-6 bg-main font-bold uppercase text-2xl text-gray-600 border-l-1 border-color text-sec">
                الرقم
              </th>
              <th className="text-center py-4 px-6 bg-main font-bold uppercase text-2xl text-gray-600 border-l-1 border-color text-sec">
                الاسم
              </th>
              <th className=" text-center py-4 px-6 bg-main font-bold uppercase text-2xl text-gray-600 text-sec">
                التفاصيل
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((data) => (
              <tr key={data.id} className="hover:bg-gray-100">
                <td className="py-4 px-6 border-b border-color border-l-1 text-2xl">
                  {data.id}
                </td>
                <td className="py-4 px-6 border-b border-color border-l-1 text-2xl">
                  {data.patient_name}
                </td>
                <td className="py-4 px-6 border-b border-color">
                  <NavLink
                    to={`/${data.id}`}
                    className="text-gray-300 hover:text-sec hover:text-white block px-3 py-2 rounded-md text-2xl font-bold bg-main max-w-fit mt-1 m-auto "
                    onClick={() => console.log(data.id)}
                  >
                    اذهب
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Outlet />
      </div>
    </>
  );
}
export default AllPationts;
