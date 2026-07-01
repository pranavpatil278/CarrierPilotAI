import { postAI } from "@/lib/api";

export default function ResumeDetails({
  fileName,
  fileSize,
  uploadDate,
}) {
  const sizeInKB = fileSize
    ? (fileSize / 1024).toFixed(2)
    : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        Resume Details
      </h2>

      <div className="space-y-5">

        {/* File Name */}
        <div className="flex items-center gap-4">
          <FileText className="text-blue-400" size={24} />

          <div>
            <p className="text-slate-400 text-sm">
              File Name
            </p>

            <p className="text-white font-medium break-all">
              {fileName || "No file selected"}
            </p>
          </div>
        </div>

        {/* File Size */}
        <div className="flex items-center gap-4">
          <HardDrive className="text-green-400" size={24} />

          <div>
            <p className="text-slate-400 text-sm">
              File Size
            </p>

            <p className="text-white font-medium">
              {sizeInKB} KB
            </p>
          </div>
        </div>

        {/* Upload Date */}
        <div className="flex items-center gap-4">
          <Calendar className="text-yellow-400" size={24} />

          <div>
            <p className="text-slate-400 text-sm">
              Upload Time
            </p>

            <p className="text-white font-medium">
              {uploadDate}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4">
          <CheckCircle2
            className="text-green-500"
            size={24}
          />

          <div>
            <p className="text-slate-400 text-sm">
              Status
            </p>

            <p className="text-green-400 font-semibold">
              Successfully Uploaded
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}