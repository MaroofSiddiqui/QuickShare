import { useEffect, useState } from "react";

import axios from "axios";

function Admin() {

  const [files, setFiles] = useState([]);

  useEffect(() => {

    fetchFiles();

  }, []);

  const fetchFiles = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/files",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFiles(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-[#050816] text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        Admin Dashboard
      </h1>

      <div className="grid gap-5">

        {files.map((file) => (

          <div
            key={file._id}
            className="
              bg-[#111827]
              border border-purple-500/20
              rounded-2xl
              p-5
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2 className="text-xl font-semibold">
                {file.displayName || file.originalname}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                {(file.size / 1024).toFixed(2)} KB
              </p>

              <p className="text-cyan-400 text-sm mt-1">
                Downloads: {file.downloads}
              </p>

              <p className="text-purple-300 text-sm mt-1">
                Folder: {file.folder || "General"}
              </p>

            </div>

            <a
              href={`http://localhost:5000/api/files/download/${file._id}`}
              target="_blank"
              rel="noreferrer"
              className="
                px-5 py-2
                rounded-xl
                bg-purple-600
                hover:bg-purple-700
                transition
              "
            >
              Download
            </a>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Admin;