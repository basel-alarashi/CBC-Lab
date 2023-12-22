import "../styles/home.css";
import { useEffect } from "react";
import RootLayouts from "../layouts/RootLayouts";

function Home() {
  return (
    <>
      <RootLayouts />
      <div className="home text-xl">
        {/* section 1 */}
        <section className="relative border-b-white border-b-[12px] ">
          <div className="image-slider">
            <div className="cover"></div>
            <div className="slide">
              <img
                src="media/images/microscope-andcomputer.jpg"
                alt="Image 4"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="slider-section absolute">
            <div className="page-container text-center">
              <p className="text-main text-6xl">المخبر الالكتروني</p>
              <p className="text-3xl text-white">
                يساعدكم موقع المخبر الالكتروني على عمل تحليل دم شامل عن طريق صورة
                أو عدة صور لعينة من دم المريض ويتم تحليل الصور وإعطاء نتيجة
                التحليل باستخدام تقنيات الذكاء الاصطناعي واﻹبصار الحاسوبي
              </p>
            </div>
          </div>
        </section>
        {/* section 2 (about) */}
        <section className="about-section page-container my-24 grid grid-cols-2">
          <div className="text ">
            <h2 className="text-5xl text-center mb-10">
              <span className="text-main">فكرة</span> الموقع
            </h2>
            <p className="text-2xl">
              تم عمل موقع المخبر الالكتروني من أجل الحصول على درجة البكالوريوس في
              قسم هندسة الحواسيب واﻷتمتة في جامعة دمشق.
              <br />
              تعتمد فكرة الموقع على مساعدة المخبريين للحصول على تحليل دم للمريض
              بأسرع وقت ممكن وبأقل التكاليف، حيث يمكن الاستغناء عن المواد
              الكيميائية واﻷجهزة المستخدمة في عملية التحليل والاعتماد على الذكاء
              الاصطناعي في ايجاد القيم اللازمة للتحليل.
              <br />
            </p>
          </div>
          <div className="images grid grid-cols-2 gap-6 justify-between">
            <img
              src="media/images/microscope2.jpg"
              alt="image"
              className="w-full h-full max-h-40 max-w-[220px] rounded m-auto"
            />
            <img
              src="media/images/image2.jpeg "
              alt="image 2"
              className="w-full h-full max-h-40 max-w-[220px] rounded m-auto"
            />
            <img
              src="media/images/image14.jpeg"
              alt="image 3"
              className="w-full h-full max-h-40 max-w-[220px] rounded m-auto"
            />
            <img
              src="media/images/image11.jpeg"
              alt="image 3"
              className="w-full h-full max-h-40 max-w-[220px] rounded m-auto"
            />
          </div>
        </section>
        {/* section 3 used technologes */}
        <section className="tech-section page-container bg-white py-20 my-20">
          <h2 className="text-5xl text-center mb-12">
            <span className="text-main">التقنيات</span> المستخدمة
          </h2>
          <div className="images grid grid-cols-8 gap-9 justify-between my-10">
            <div className="image text-center">
              <img
                src="media/images/html.png"
                alt="image"
                className="w-full h-full max-h-40 max-w-[220px] rounded m-auto pb-5"
              />
              <label htmlFor="image-1">HTML</label>
            </div>
            <div className="image text-center">
              <img
                src="media/images/css.png"
                alt="image"
                className="w-full h-full max-h-40 max-w-[220px] rounded m-auto pb-5"
              />
              <label htmlFor="image-1">CSS</label>
            </div>
            <div className="image text-center">
              <img
                src="media/images/java-script.png"
                alt="image"
                className="w-full h-full max-h-40 max-w-[220px] rounded m-auto pb-5"
              />
              <label htmlFor="image-1">JS</label>
            </div>
            <div className="image text-center">
              <img
                src="media/images/react.png"
                alt="image"
                className="w-full h-full max-h-40 max-w-[220px] rounded m-auto pb-5"
              />
              <label htmlFor="image-1">React</label>
            </div>
            <div className="image text-center">
              <img
                src="media/images/python.png"
                alt="image"
                className="w-full h-full max-h-40 max-w-[220px] rounded m-auto pb-5"
              />
              <label htmlFor="image-1">Python</label>
            </div>
            <div className="image text-center">
              <img
                src="media/images/django-480.png"
                alt="image"
                className="w-full h-full max-h-40 max-w-[220px] rounded m-auto pb-5"
              />
              <label htmlFor="image-1">Django</label>
            </div>
            <div className="image text-center">
              <img
                src="media/images/yologo_2.png"
                alt="image"
                className="w-full h-full max-h-40 max-w-[220px] rounded m-auto pb-5"
              />
              <label htmlFor="image-1">Yolo</label>
            </div>
            <div className="image text-center">
              <img
                src="media/images/postgresql-1.png"
                alt="image"
                className="w-full h-full max-h-40 max-w-[220px] rounded m-auto pb-5"
              />
              <label htmlFor="">postgresql</label>
            </div>
          </div>
        </section>
        <footer>
          <div className="page-container bg-main p-5 text-center text-sec">
            &copy; 2023 جميع الحقوق محفوظة
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
