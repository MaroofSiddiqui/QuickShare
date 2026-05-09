import { useRef, useState } from "react";
import API from "../api";

function Upload() {

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState([]);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [folder, setFolder] = useState("General");
  const [uploadMode, setUploadMode] = useState("saveanyway");

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {

    const files = Array.from(e.target.files);

    if (!files || files.length === 0) return;

    const maxSize = 100 * 1024 * 1024;

    const oversized = files.find(
      (file) => file.size > maxSize
    );

    if (oversized) {
      setMessage("One or more files exceed 100MB");
      return;
    }

    setMessage("");
    setSelectedFile(files);

  };

  const handleUpload = async () => {

    if (selectedFile.length === 0) {

      setMessage("Please select a file");
      return;

    }

    setLoading(true);

    const formData = new FormData();

    selectedFile.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("folder", folder);

    formData.append(
      "guestId",
      localStorage.getItem("guestId")
    );

    formData.append(
      "uploadMode",
      uploadMode
    );

    try {

      const res = await API.post(
        "/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(localStorage.getItem("token") && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },

          onUploadProgress: (progressEvent) => {

            const percent = Math.round(
              (progressEvent.loaded * 100) /
              progressEvent.total
            );

            setUploadProgress(percent);

          },
        }
      );

      console.log(res.data);

      setMessage("Files uploaded successfully");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      setUploadProgress(0);
      setLoading(false);
      setSelectedFile([]);

    } catch (error) {

      console.log(error);
      console.log(error.response);
      console.log(error.response?.data);

      setMessage(
        error.response?.data?.message || "Upload failed"
      );

      setLoading(false);

      setTimeout(() => {
        setMessage("");
      }, 3000);

    }

  };

  return (

    <div
      onClick={handleClick}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {

        e.preventDefault();

        setDragActive(false);

        const droppedFiles = Array.from(
          e.dataTransfer.files
        );

        if (droppedFiles.length > 0) {
          setSelectedFile(droppedFiles);
        }

      }}
      className={`
        max-w-4xl
        mx-auto
        cursor-pointer
        border border-dashed
        rounded-[32px]
        px-10 py-14
        text-center
        bg-gradient-to-b
        from-[#0f172a]/80
        to-[#020617]
        backdrop-blur-2xl
        transition-all
        duration-300
        shadow-[0_0_80px_rgba(76,29,149,0.15)]

        ${
          dragActive
            ? "border-cyan-400 scale-[1.02] shadow-[0_0_50px_rgba(34,211,238,0.35)]"
            : "border-purple-500/20 hover:border-purple-400/40"
        }
      `}
    >

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className="
          w-24 h-24
          mx-auto mb-6
          rounded-3xl
          bg-gradient-to-br
          from-purple-500
          to-indigo-600
          flex items-center justify-center
          text-5xl
          shadow-lg
        "
      >
        ☁️
      </div>

      <h2 className="text-4xl font-bold text-white mb-3">
        Drag & Drop Your Files
      </h2>

      <p className="text-gray-400 text-lg mb-10">
        Upload securely and share instantly — max 100MB
      </p>

      <div className="flex items-center justify-center gap-4 flex-wrap">

        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="
            h-14
            min-w-[190px]
            px-5
            rounded-2xl
            bg-[#111827]
            border border-purple-500/20
            text-white
            outline-none
          "
        >
          <option value="General">General</option>
          <option value="Images">Images</option>
          <option value="Documents">Documents</option>
          <option value="Videos">Videos</option>
          <option value="Music">Music</option>
        </select>

        <select
          value={uploadMode}
          onChange={(e) => setUploadMode(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="
            h-14
            min-w-[220px]
            px-5
            rounded-2xl
            bg-[#111827]
            border border-purple-500/20
            text-white
            outline-none
          "
        >
          <option value="saveanyway">
            Save Anyway
          </option>

          <option value="replace">
            Replace Existing
          </option>
        </select>

        <button
          onClick={(e) => {

            e.stopPropagation();
            handleClick();

          }}
          className="
            h-14
            min-w-[190px]
            px-6
            rounded-2xl
            bg-gradient-to-r
            from-purple-500
            to-indigo-500
            text-white
            font-semibold
            hover:scale-105
            transition
          "
        >
          Choose Files
        </button>

        <button
          onClick={(e) => {

            e.stopPropagation();
            handleUpload();

          }}
          disabled={loading}
          className="
            h-14
            min-w-[190px]
            px-6
            rounded-2xl
            bg-white
            text-black
            font-semibold
            hover:scale-105
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Uploading..." : "Upload Files"}
        </button>

      </div>

      {selectedFile.length > 0 && (

        <div
          className="
            mt-8
            rounded-3xl
            border border-purple-500/20
            bg-[#111827]/50
            p-5
            text-left
            max-h-[220px]
            overflow-y-auto
          "
        >

          <p className="text-white font-semibold mb-4">
            Selected Files
          </p>

          <div className="space-y-3">

            {selectedFile.map((file, index) => (

              <div
                key={index}
                className="
                  flex items-center justify-between
                  rounded-2xl
                  bg-[#0f172a]
                  px-4 py-3
                  border border-purple-500/10
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-11 h-11
                      rounded-xl
                      bg-gradient-to-br
                      from-purple-500
                      to-indigo-600
                      flex items-center justify-center
                    "
                  >
                    📄
                  </div>

                  <div>

                    <p className="text-white text-sm font-medium truncate max-w-[300px]">
                      {file.name}
                    </p>

                    <p className="text-gray-400 text-xs">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

      {uploadProgress > 0 && (

        <div className="mt-8">

          <div className="flex justify-between text-sm text-gray-400 mb-2">

            <span>Uploading...</span>

            <span>{uploadProgress}%</span>

          </div>

          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">

            <div
              className="
                h-full
                bg-gradient-to-r
                from-purple-500
                to-indigo-500
                transition-all
                duration-300
              "
              style={{
                width: `${uploadProgress}%`,
              }}
            />

          </div>

        </div>

      )}

      {message && (

        <div
          className={`
            mt-6
            inline-flex
            px-5 py-3
            rounded-2xl
            border

            ${
              message.includes("success")
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }
          `}
        >
          {message}
        </div>

      )}

    </div>

  );

}

export default Upload;