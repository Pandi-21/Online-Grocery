import { useEffect } from "react";

export default function ImageUploader({ images, onChange }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files].slice(0, 5); // max 5
    onChange(newImages);
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  // Cleanup object URLs to avoid memory leaks
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
      <label className="block text-sm font-medium mb-1">Images (max 5)</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded file:border-0
        file:text-sm file:font-semibold
        file:bg-green-50 file:text-green-700
        hover:file:bg-green-100"
      />
      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={
                typeof img === "string"
                  ? `/recipes/uploads/${img}` // ✅ corrected path for Recipes
                  : URL.createObjectURL(img)
              }
              alt=""
              className="w-full h-20 object-cover rounded border"
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
      </div>
    </div>
  );
}
