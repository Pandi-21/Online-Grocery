import { useEffect } from "react";
import { Plus } from "lucide-react";

export default function ImageUploader({ images, onChange, backendUrl }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files].slice(0, 5); // max 5
    onChange(newImages);
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img instanceof File) {
          URL.revokeObjectURL(img);
        }
      });
    };
  }, [images]);

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Product Images*
      </label>

      <div className="grid grid-cols-5 gap-3">
        {/* Uploaded Images */}
        {images.map((img, index) => (
          <div
            key={index}
            className="relative w-full h-28 flex items-center justify-center border-2 border-dashed rounded-lg bg-gray-50"
          >
            <img
              src={
                typeof img === "string"
                  ? `${backendUrl}/recipes/uploads/${img}`
                  : URL.createObjectURL(img)
              }
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-1"
            >
              ×
            </button>
          </div>
        ))}

        {/* Add Image Slots */}
        {images.length < 5 &&
          [...Array(5 - images.length)].map((_, idx) => (
            <label
              key={idx}
              className="w-full h-28 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed rounded-lg text-gray-400 hover:border-green-500 hover:text-green-600 transition"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-sm">Add Image</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ))}
      </div>
    </div>
  );
}
