import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { QRCodeCanvas } from "qrcode.react";

function FileList() {

  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [sortType, setSortType] = useState("newest");
  const [filterType, setFilterType] = useState("all");
  const [folderFilter, setFolderFilter] = useState("All");
  const [showQR, setShowQR] = useState(null);
  const token = localStorage.getItem("token");
  const isGuest = !token;

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/files?guestId=${localStorage.getItem("guestId")}`,
        {
          headers: {
            ...(localStorage.getItem("token") && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },
        }
      );

      setFiles(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const handleDelete = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/files/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("File deleted!");

      fetchFiles();

    } catch (error) {

      console.log(error);

    }

  };

  const filteredFiles = files

    .filter((file) => {

      const nameMatch =
        file.originalname
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFolder =
        folderFilter === "All" ||
        file.folder === folderFilter;

      const ext = file.originalname
        .split(".")
        .pop()
        .toLowerCase();

      if (filterType === "all") {
        return nameMatch && matchesFolder;
      }

      if (
        filterType === "image" &&
        ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)
      ) {
        return nameMatch && matchesFolder;
      }

      if (
        filterType === "video" &&
        ["mp4", "mkv", "mov"].includes(ext)
      ) {
        return nameMatch && matchesFolder;
      }

      if (
        filterType === "audio" &&
        ["mp3", "wav"].includes(ext)
      ) {
        return nameMatch && matchesFolder;
      }

      if (
        filterType === "pdf" &&
        ext === "pdf"
      ) {
        return nameMatch && matchesFolder;
      }

      return false;

    })

    .sort((a, b) => {

      if (sortType === "newest") {
        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );
      }

      if (sortType === "oldest") {
        return (
          new Date(a.createdAt) -
          new Date(b.createdAt)
        );
      }

      if (sortType === "largest") {
        return b.size - a.size;
      }

      return 0;

    });

  const formatDate = (date) => {

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  };

  const totalStorage = files.reduce((acc, file) => {
    return acc + file.size;
  }, 0);

  return (

    <div className="w-full flex gap-6 text-white p-6 items-start">

      <div
        className="
          w-[300px]
          min-h-fit
          rounded-3xl
          border border-purple-500/20
          bg-[#0b1120]/90
          backdrop-blur-2xl
          p-6
          shadow-2xl
          h-full
        "
      >

        <h2 className="text-2xl font-bold mb-6">
          Search Files
        </h2>

        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full
            px-4 py-3
            rounded-2xl
            bg-[#111827]
            border border-purple-500/20
            outline-none
            mb-5
            focus:border-purple-500
          "
        />

        <div className="space-y-4">

          <div>

            <p className="text-gray-400 mb-2">
              Sort By
            </p>

            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="
                w-full
                px-4 py-3
                rounded-2xl
                bg-[#111827]
                border border-purple-500/20
                outline-none
              "
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="largest">
                Largest
              </option>

            </select>

          </div>

          <div>

            <p className="text-gray-400 mb-2">
              Filter By Type
            </p>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="
                w-full
                px-4 py-3
                rounded-2xl
                bg-[#111827]
                border border-purple-500/20
                outline-none
              "
            >
              <option value="all">All Files</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="pdf">PDF</option>
            </select>

          </div>

          <div>

            <p className="text-gray-400 mb-2">
              Filter By Folder
            </p>

            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="
                w-full
                px-4 py-3
                rounded-2xl
                bg-[#111827]
                border border-purple-500/20
                outline-none
              "
            >
              <option value="All">All Folders</option>
              <option value="General">General</option>
              <option value="Images">Images</option>
              <option value="Documents">Documents</option>
              <option value="Videos">Videos</option>
              <option value="Music">Music</option>
            </select>

          </div>

        </div>

        <div
          className="
            mt-8
            rounded-3xl
            border border-purple-500/20
            bg-[#111827]/70
            p-5
            overflow-hidden
          "
        >

          <p className="text-gray-400 mb-4">
            Storage Overview
          </p>

          <div className="flex flex-col items-center justify-center gap-4">

            <div
              className="
                w-28 h-28
                rounded-full
                border-[10px]
                border-purple-500/30
                flex items-center justify-center
                text-lg font-bold
              "
            >
              {(totalStorage / (1024 * 1024)).toFixed(2)}
            </div>

            <div>

              <p className="text-2xl font-bold text-center leading-none">
                {files.length} Files
              </p>

              <p className="text-gray-400 text-sm">
                {(totalStorage / (1024 * 1024)).toFixed(2)} MB Used
              </p>

            </div>

          </div>

        </div>

      </div>

      <div
        className="
          flex-1
          rounded-3xl
          border border-purple-500/20
          bg-[#0b1120]/90
          backdrop-blur-2xl
          p-8
          overflow-hidden
        "
      >

        <div className="flex items-center justify-between mb-10">

          <div className="flex items-center gap-5">

            <div
              className="
                w-20 h-20
                rounded-3xl
                bg-gradient-to-br
                from-purple-500
                to-indigo-600
                flex items-center justify-center
                text-4xl
              "
            >
              📁
            </div>

            <div>

              <h2 className="text-4xl font-bold leading-tight">
                Uploaded Files
              </h2>

              <p className="text-gray-400 mt-2">
                Manage and share your files securely
              </p>

            </div>

          </div>

          <div className="flex gap-4">

            <div
              className="
                px-8 py-5
                rounded-3xl
                border border-purple-500/20
                bg-[#111827]/70
              "
            >

              <p className="text-3xl font-bold">
                {files.length}
              </p>

              <p className="text-gray-400 text-sm text-center">
                Total Files
              </p>

            </div>

            <div
              className="
                px-8 py-5
                rounded-3xl
                border border-purple-500/20
                bg-[#111827]/70
              "
            >

              <p className="text-3xl font-bold">
                {(totalStorage / (1024 * 1024)).toFixed(2)} MB
              </p>

              <p className="text-gray-400 text-sm text-center">
                Total Used
              </p>

            </div>

          </div>

        </div>

        <div
          className="
            grid
            grid-cols-[3fr_1fr_1.4fr_1fr_1fr_2fr]
            px-6 py-5
            rounded-2xl
            border border-purple-500/20
            bg-[#111827]/50
            text-gray-400
            mb-4
            text-sm
          "
        >

          <div>Name</div>
          <div>Size</div>
          <div>Date</div>
          <div>Downloads</div>
          <div>Folder</div>

          <div className="text-center">
            Actions
          </div>

        </div>

        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 custom-scroll">

          {filteredFiles.map((file) => {

            const shareLink =
              `http://localhost:5000/api/files/download/${file._id}`;

            return (

              <div
                key={file._id}
                className="
                  grid
                  grid-cols-[3fr_1fr_1.4fr_1fr_1fr_2fr]
                  items-center
                  px-6 py-5
                  rounded-3xl
                  border border-purple-500/20
                  bg-[#0f172a]/80
                  hover:border-purple-500/40
                  transition
                "
              >

                <div className="flex items-center gap-4 min-w-0">

                  <img
                    src={`http://localhost:5000/${file.path}`}
                    alt=""
                    onClick={() =>
                      setPreviewImage(
                        `http://localhost:5000/${file.path}`
                      )
                    }
                    className="
                      w-16 h-16
                      rounded-2xl
                      object-cover
                      cursor-pointer
                    "
                  />

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <p className="text-base font-semibold truncate max-w-[180px]">
                        {file.displayName || file.originalname}
                      </p>

                      <button title="Edit" className="text-yellow-400">
                        ✏️
                      </button>

                    </div>

                    <p className="text-gray-400 text-sm">
                      Stored securely on QuickShare
                    </p>

                  </div>

                </div>

                <div className="text-sm">
                  {(file.size / 1024).toFixed(2)} KB
                </div>

                <div className="text-sm leading-5 text-gray-300 whitespace-nowrap">
                  {formatDate(file.createdAt)}
                </div>

                <div className="text-green-400 font-bold">
                  {file.downloads}
                </div>

                <div className="text-purple-300 whitespace-nowrap">
                  {file.folder || "General"}
                </div>

                <div className="flex items-center justify-center gap-2">

                  <a title="Download"
                    href={shareLink}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      w-10 h-10
                      rounded-xl
                      bg-purple-500/20
                      border border-purple-500/30
                      flex items-center justify-center
                      hover:bg-purple-500/30
                    "
                  >
                    ⬇️
                  </a>

                  <button title="Share Link"
                    onClick={() => {

                      navigator.clipboard.writeText(
                        shareLink
                      );

                      toast.success("Link copied!");

                    }}
                    className="
                      w-10 h-10
                      rounded-xl
                      bg-cyan-500/20
                      border border-cyan-500/30
                      flex items-center justify-center
                    "
                  >
                    🔗
                  </button>

                  <button title="QR Code"
                    onClick={() => setShowQR(shareLink)}
                    className="
                      w-10 h-10
                      rounded-xl
                      bg-green-500/20
                      border border-green-500/30
                      flex items-center justify-center
                    "
                  >
                    📱
                  </button>

                  {!isGuest && (
                    <button title="Send Email"
                      onClick={async () => {

                        const email =
                          prompt("Enter receiver email");

                        if (!email) return;

                        try {

                          await axios.post(
                            `http://localhost:5000/api/files/share-email/${file._id}`,
                            { email },
                            {
                              headers: {
                                Authorization:
                                  `Bearer ${localStorage.getItem("token")}`,
                              },
                            }
                          );

                          toast.success("Email sent!");

                        } catch (error) {

                          toast.error("Failed to send email");

                        }

                      }}
                      className="
                        w-10 h-10
                        rounded-xl
                        bg-emerald-500/20
                        border border-emerald-500/30
                        flex items-center justify-center
                      "
                    >
                      ✉️
                    </button>
                  )}

                  {!isGuest && (
                    <button title="Delete"
                      onClick={() => {

                        const confirmDelete =
                          window.confirm(
                            `Delete ${file.originalname}?`
                          );

                        if (confirmDelete) {
                          handleDelete(file._id);
                        }

                      }}
                      className="
                        w-10 h-10
                        rounded-xl
                        bg-red-500/20
                        border border-red-500/30
                        flex items-center justify-center
                      "
                    >
                      🗑️
                    </button>
                  )}

                </div>

              </div>

            );

          })}

        </div>

      </div>

      {
        previewImage && (

          <div
            onClick={() => setPreviewImage(null)}
            className="
              fixed inset-0 z-[100]
              bg-black/80
              backdrop-blur-md
              flex items-center justify-center
              p-10
            "
          >

            <img
              src={previewImage}
              alt="Preview"
              className="
                max-w-full
                max-h-full
                rounded-2xl
              "
            />

          </div>

        )
      }

      {
        showQR && (

          <div
            className="
              fixed inset-0 z-[200]
              bg-black/80
              backdrop-blur-md
              flex items-center justify-center
            "
          >

            <div
              className="
                bg-[#0f172a]
                border border-purple-500/20
                rounded-3xl
                p-8
                flex flex-col items-center
                gap-5
              "
            >

              <h2 className="text-2xl font-bold">
                Share QR Code
              </h2>

              <div className="bg-white p-4 rounded-2xl">

                <QRCodeCanvas
                  value={showQR}
                  size={220}
                />

              </div>

              <button
                onClick={() => setShowQR(null)}
                className="
                  px-5 py-2
                  rounded-xl
                  bg-red-500/20
                  border border-red-500/30
                  text-red-400
                "
              >
                Close
              </button>

            </div>

          </div>

        )
      }

    </div>

  );

}

export default FileList;