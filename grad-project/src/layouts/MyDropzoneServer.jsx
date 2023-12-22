import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { addPationtImg, base64Image } from "../recoil/atoms";
import { useRecoilState } from "recoil";
import api from "../api/posts";
import { useParams } from "react-router-dom";

const MYDropzoneServer = ({ className }) => {
  const { id } = useParams();
  const [rejected, setRejected] = useState([]);
  const [baseImage, setBaseImage] = useRecoilState(base64Image);
  const [files, setFiles] = useRecoilState(addPationtImg);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      // Do something if acceptedFiles is not nullish and has a length greater than zero
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) => {
          return Object.assign(file, { preview: URL.createObjectURL(file) });
          // this is simillar to this code {...file, preview: }
        }),
      ]);
      uploadImage(acceptedFiles);
      console.log(base64Image)
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 3120 * 1000,
    onDrop,
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`patients/${id}/`);
        setFiles(res.data.images);
        // console.log(res.data.images);
        // call a function that make a req to run the model on the backEnd
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (id) => {
    setFiles((files) => files.filter((file) => file.id !== id));
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (id) => {
    setRejected((files) => files.filter(({ file }) => file.id !== id));
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     if (!files?.length) return;
  // //  If file is falsy, the statement immediately returns from the current function or component without executing any further code

  //     const formData = new FormData();
  //     files.forEach((file) => formData.append("file", file));
  //     formData.append("upload_preset", "friendsbook");

  //     const URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  //     const data = await fetch(URL, {
  //       method: "POST",
  //       body: formData,
  //     }).then((res) => res.json());

  //     console.log(data);
  //   };

  const uploadImage = (e) => {
    e.map(async (file) => {
      const textImageBase64 = await convertBase64(file);
      setBaseImage((prev) => [...prev, textImageBase64]);
    });
  };
  // console.log(baseImage);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
        // setBaseImage(...[fileReader.result]);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <input
          type="file"
          {...getInputProps()}
          id="myInput"
          // onInput={(e) => {
          //   uploadImage(e);
          // }}
        />
        <div className="flex flex-col items-center justify-center gap-4">
          <ArrowUpTrayIcon className="w-5 h-5 fill-current" />
          {isDragActive ? (
            <p>أسقط الملفات هنا</p>
          ) : (
            <p>قم بسحب وإسقاط الملفات هنا ، أو انقر لتحديد الملفات</p>
          )}
        </div>
      </div>
      {/* Preview */}
      <section className="mt-10">
        <div className="flex gap-4">
          <h2 className="title text-3xl font-semibold">معاينة</h2>
          <button
            type="button"
            onClick={removeAll}
            className="mt-1 text-[12px] uppercase tracking-wider font-bold border border-secondary-400 rounded-md px-3 hover:bg-red-500 hover:text-white transition-colors border-sec-color text-main"
          >
            احذف جميع الملفات
          </button>
        </div>

        {/* Accepted files */}
        <h3 className="title text-lg font-semibold text-black mt-10 border-b pb-3">
          الملفات المقبولة
        </h3>
        <ul className="mt-6 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {files.map((file) => (
            <li key={file.id} className="relative h-32 rounded-md shadow-lg">
              <img
                src={file.image}
                alt='image error'
                width={100}
                height={100}
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
                className="h-full w-full object-contain rounded-md"
              />
              <button
                type="button"
                className=" bg-red-500 w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                onClick={() => removeFile(file.id)}
              >
                <XMarkIcon className="w-6 h-6 fill-white hover:fill-red-700 transition-colors " />
              </button>
              {/*<p className="mt-2 text-neutral-500 text-[12px] font-medium">
                {file.name}
              </p>*/}
            </li>
          ))}
        </ul>

        {/* Rejected Files */}
        <h3 className="title text-lg font-semibold text-black mt-24 border-b pb-3">
          الملفات المرفوضة
        </h3>
        <ul className="mt-6 flex flex-col">
          {rejected.map(({ file, errors }) => (
            <li key={file.id} className="flex items-start justify-between">
              <div>
                <p className="mt-2 text-neutral-500 text-sm font-medium">
                  {file.id}
                </p>
                <ul className="text-[12px] text-red-400">
                  {errors.map((error) => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-red-400 hover:text-white transition-colors"
                onClick={() => removeRejected(file.id)}
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>

    // <img src={files.images} alt="" />
  );
};

export default MYDropzoneServer;
